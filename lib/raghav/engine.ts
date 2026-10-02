import { RAGHAV_SYSTEM_PROMPT } from "./prompts";
import { SearchSource } from "./types";
import { requiresWebResearch, performWebResearch } from "./webSearch";

// Dynamic import of LiteRT LM Engine to ensure proper browser/WebGPU execution
let litertEngine: import("@litert-lm/core").Engine | null = null;
let activeConversation: import("@litert-lm/core").Conversation | null = null;

/**
 * Checks if an error is a WebGPU device loss / GPU out-of-memory error.
 */
function isGpuDeviceLostError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("QueueWorkDoneStatus") ||
    msg.includes("Task failed with state") ||
    msg.includes("Device lost") ||
    msg.includes("device was lost") ||
    msg.includes("GPU device") ||
    msg.includes("out of memory")
  );
}

/**
 * Initializes the LiteRT LM engine with Gemma 4 E2B model artifact.
 * Uses WebGPU backend for accelerated on-device inference.
 * maxNumTokens is configured to 4096 to provide ample context space for complex
 * civil engineering math problems, formulas, step-by-step derivations, and multi-turn chat.
 */
export async function initRaghavEngine(
  modelSource: Blob | string
): Promise<void> {
  const { Engine } = await import("@litert-lm/core");

  // Dispose previous engine if present
  await cleanupRaghavEngine();

  // Create LiteRT engine instance with local model artifact
  // 4096 max tokens provides large context for engineering calculations and inputs
  litertEngine = await Engine.create({
    model: modelSource,
    mainExecutorSettings: {
      maxNumTokens: 4096,
    },
  });

  // Create active conversation session with the Raghav persona preface
  await resetRaghavConversation();
}

/**
 * Resets the active conversation instance while keeping the loaded LiteRT engine.
 * Clears the KV cache on WebGPU so subsequent questions (even unrelated ones)
 * get a clean, full-capacity context window without task failures.
 */
export async function resetRaghavConversation(): Promise<void> {
  if (!litertEngine) return;

  if (activeConversation) {
    try {
      await activeConversation.delete();
    } catch (e) {
      console.warn("Error deleting conversation session:", e);
    }
    activeConversation = null;
  }

  activeConversation = await litertEngine.createConversation({
    sessionConfig: {
      maxOutputTokens: 2048,
    },
    preface: {
      messages: [
        {
          role: "system",
          content: RAGHAV_SYSTEM_PROMPT,
        },
      ],
    },
  });
}

/**
 * Checks whether the LiteRT LM engine and active conversation are loaded and ready in memory.
 */
export function isRaghavEngineLoaded(): boolean {
  return litertEngine !== null && activeConversation !== null;
}

/**
 * Cleans up the active conversation and engine instances.
 */
export async function cleanupRaghavEngine(): Promise<void> {
  if (activeConversation) {
    try {
      await activeConversation.delete();
    } catch (e) {
      console.warn("Error deleting conversation:", e);
    }
    activeConversation = null;
  }

  if (litertEngine) {
    try {
      await litertEngine.delete();
    } catch (e) {
      console.warn("Error deleting engine:", e);
    }
    litertEngine = null;
  }
}

/**
 * Cancels active generation in the current conversation.
 */
export function cancelRaghavGeneration(): void {
  if (activeConversation) {
    try {
      activeConversation.cancel();
    } catch (e) {
      console.warn("Error cancelling generation:", e);
    }
  }
}

import { SiteEnvironmentData, formatEnvironmentContextPrompt } from "./weather";

/**
 * Sends a message to Raghav, incorporating real-time site location & weather context,
 * performing optional web research if time-sensitive standards or legal information is requested,
 * and streams the response token by token.
 * If the WebGPU device is lost mid-inference, cleans up and throws a recoverable error.
 */
export async function* streamRaghavChat(
  userPrompt: string,
  environment?: SiteEnvironmentData | null
): AsyncGenerator<
  { text: string; sources?: SearchSource[] },
  void,
  unknown
> {
  if (!litertEngine) {
    throw new Error(
      "Raghav engine is not initialized. Please load the Gemma 4 E2B model first."
    );
  }

  // Ensure an active conversation is present
  if (!activeConversation) {
    await resetRaghavConversation();
  }

  if (!activeConversation) {
    throw new Error(
      "Failed to establish an active conversation session with the WebGPU engine."
    );
  }

  let finalPrompt = userPrompt;
  let sources: SearchSource[] | undefined;

  const contextBlocks: string[] = [];

  // 1. Prepend real-time user location and weather context if available
  if (environment) {
    contextBlocks.push(formatEnvironmentContextPrompt(environment));
  }

  // 2. Optional web research step: only for time-sensitive statutory/standard questions
  if (requiresWebResearch(userPrompt)) {
    const research = await performWebResearch(userPrompt);
    if (research.context) {
      contextBlocks.push(research.context);
      sources = research.sources.length > 0 ? research.sources : undefined;
    }
  }

  if (contextBlocks.length > 0) {
    finalPrompt = `${contextBlocks.join("\n\n")}\n\nUser Question:\n${userPrompt}`;
  }

  // Stream tokens from local LiteRT conversation
  let stream: ReadableStream;
  try {
    stream = activeConversation.sendMessageStreaming(finalPrompt);
  } catch (err: unknown) {
    console.warn("Initial stream start failed, attempting conversation reset recovery:", err);
    // If previous stream left conversation in busy or overflow state, reset conversation and retry
    try {
      await resetRaghavConversation();
      if (!activeConversation) {
        throw err;
      }
      stream = activeConversation.sendMessageStreaming(finalPrompt);
    } catch (retryErr) {
      if (isGpuDeviceLostError(retryErr)) {
        await cleanupRaghavEngine();
        throw new Error(
          "WebGPU device was lost while starting generation. Please close other GPU-intensive tabs and reload the model."
        );
      }
      throw retryErr;
    }
  }

  let accumulatedText = "";
  const reader = stream.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      if (value) {
        let chunkText = "";
        if (typeof value.content === "string") {
          chunkText = value.content;
        } else if (Array.isArray(value.content)) {
          chunkText = value.content
            .map((c: { type: string; text?: string }) =>
              c.type === "text" ? c.text : ""
            )
            .join("");
        }

        if (chunkText) {
          accumulatedText += chunkText;
          yield { text: accumulatedText, sources };
        }
      }
    }
  } catch (err: unknown) {
    try {
      reader.releaseLock();
    } catch {
      // ignore
    }

    if (isGpuDeviceLostError(err)) {
      // Attempt to salvage the engine by resetting conversation KV cache
      try {
        await resetRaghavConversation();
        throw new Error(
          "Inference calculation exceeded available GPU memory or context length. The conversation has been reset so you can continue immediately."
        );
      } catch {
        // Device is truly lost
        await cleanupRaghavEngine();
        throw new Error(
          "WebGPU device encountered an error during calculation. Please reload the model to continue."
        );
      }
    }
    throw err;
  } finally {
    try {
      reader.releaseLock();
    } catch {
      // Reader may already be released in the catch block above
    }
  }
}

