import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CLOUD_SPEECH_API =
  process.env.CLOUD_SPEECH_API ||
  process.env.NEXT_PUBLIC_CLOUD_SPEECH_API ||
  "";

/**
 * Strips special characters ($, &, -, _, *, etc.) and markdown symbols so that
 * the speech engine reads only text and numbers with natural sentence pauses.
 */
function cleanTextForSpeech(markdown: string): string {
  if (!markdown) return "";

  let text = markdown;

  // 1. Remove code blocks and markdown links/images
  text = text.replace(/```[\s\S]*?```/g, " ");
  text = text.replace(/`([^`]+)`/g, "$1");
  text = text.replace(/!\[.*?\]\(.*?\)/g, "");
  text = text.replace(/\[(.*?)\]\(.*?\)/g, "$1");

  // 2. Remove headings and blockquote markers
  text = text.replace(/^#{1,6}\s+/gm, "");
  text = text.replace(/^>\s+/gm, "");

  // 3. Skip special characters: $, &, -, _, *, #, @, %, ^, ~, |, /, \, +, =, <, >, (, ), [, ], {, }
  // Replace with a space to prevent words/numbers from merging together
  text = text.replace(/[\$&_\*\-\–—#@%\^~\|\/\\\+=<>\(\)\[\]\{\}]/g, " ");

  // 4. Normalize exclamations and multiple punctuation into clean pauses
  text = text.replace(/!+/g, ". ");
  text = text.replace(/\?+/g, "? ");
  text = text.replace(/[:;]/g, ", ");
  text = text.replace(/\.{2,}/g, ". ");

  // 5. Clean up any punctuation floating without words
  text = text.replace(/\s+([.,?])/g, "$1 ");

  // 6. Normalize whitespace
  text = text.replace(/\s+/g, " ").trim();

  // If text is very long, limit to first 3000 chars for TTS payload safety
  if (text.length > 3000) {
    const truncated = text.slice(0, 3000);
    const lastPeriod = truncated.lastIndexOf(".");
    text = lastPeriod > 1000 ? truncated.slice(0, lastPeriod + 1) : truncated + ".";
  }

  return text;
}

/**
 * Splits text into chunks where each chunk is strictly under maxBytes (e.g. 3500 bytes in UTF-8).
 * Breaks along natural sentence boundaries (., !, ?, ।, \n) or words to ensure clean natural speech.
 */
function splitTextIntoSafeByteChunks(text: string, maxBytes: number = 3500): string[] {
  if (Buffer.byteLength(text, "utf8") <= maxBytes) {
    return [text];
  }

  // Split by sentence terminators including Bengali/Hindi danda '।'
  const sentences = text.match(/[^.!?।\n]+[.!?।\n]+|[^.!?।\n]+$/g) || [text];
  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    const candidate = currentChunk ? `${currentChunk} ${sentence.trim()}` : sentence.trim();
    if (Buffer.byteLength(candidate, "utf8") <= maxBytes) {
      currentChunk = candidate;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      // If a single sentence exceeds maxBytes, split by words
      if (Buffer.byteLength(sentence, "utf8") > maxBytes) {
        const words = sentence.split(" ");
        let subChunk = "";
        for (const word of words) {
          const subCandidate = subChunk ? `${subChunk} ${word}` : word;
          if (Buffer.byteLength(subCandidate, "utf8") <= maxBytes) {
            subChunk = subCandidate;
          } else {
            if (subChunk) chunks.push(subChunk);
            subChunk = word;
          }
        }
        currentChunk = subChunk;
      } else {
        currentChunk = sentence.trim();
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks.length > 0 ? chunks : [text];
}

const VOICE_MAP: Record<string, { languageCode: string; name: string }> = {
  hi: { languageCode: "hi-IN", name: "hi-IN-Standard-B" },
  "hi-IN": { languageCode: "hi-IN", name: "hi-IN-Standard-B" },
  bn: { languageCode: "bn-IN", name: "bn-IN-Standard-B" },
  "bn-IN": { languageCode: "bn-IN", name: "bn-IN-Standard-B" },
  ta: { languageCode: "ta-IN", name: "ta-IN-Standard-B" },
  "ta-IN": { languageCode: "ta-IN", name: "ta-IN-Standard-B" },
  ml: { languageCode: "ml-IN", name: "ml-IN-Standard-B" },
  "ml-IN": { languageCode: "ml-IN", name: "ml-IN-Standard-B" },
  en: { languageCode: "en-IN", name: "en-IN-Standard-B" },
  "en-IN": { languageCode: "en-IN", name: "en-IN-Standard-B" },
};

/**
 * Detect appropriate voice language code and male voice model.
 */
function getVoiceConfig(text: string, lang?: string) {
  if (lang && VOICE_MAP[lang]) {
    return VOICE_MAP[lang];
  }
  // Check for Bengali script
  if (/[\u0980-\u09FF]/.test(text)) {
    return { languageCode: "bn-IN", name: "bn-IN-Standard-B" };
  }
  // Check for Devanagari (Hindi)
  if (/[\u0900-\u097F]/.test(text)) {
    return { languageCode: "hi-IN", name: "hi-IN-Standard-B" };
  }
  // Check for Tamil
  if (/[\u0B80-\u0BFF]/.test(text)) {
    return { languageCode: "ta-IN", name: "ta-IN-Standard-B" };
  }
  // Check for Malayalam
  if (/[\u0D00-\u0D7F]/.test(text)) {
    return { languageCode: "ml-IN", name: "ml-IN-Standard-B" };
  }
  // Default to Indian English
  return { languageCode: "en-IN", name: "en-IN-Standard-B" };
}

export async function POST(req: Request) {
  try {
    const { text, lang } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }

    const cleanedText = cleanTextForSpeech(text);

    if (!cleanedText) {
      return NextResponse.json({ error: "No readable speech text." }, { status: 400 });
    }

    if (!CLOUD_SPEECH_API) {
      return NextResponse.json({
        success: false,
        fallback: true,
        cleanedText,
        error: "CLOUD_SPEECH_API is not configured.",
      });
    }

    const voiceConfig = getVoiceConfig(cleanedText, lang);

    // Call Google Cloud Text-to-Speech API configured strictly with Male Voice
    const googleTtsUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(
      CLOUD_SPEECH_API
    )}`;

    // Divide text into safe chunks under 3500 UTF-8 bytes to guarantee compliance with Google 5000 byte limit
    const textChunks = splitTextIntoSafeByteChunks(cleanedText, 3500);
    const audioBuffers: Buffer[] = [];

    for (const chunk of textChunks) {
      if (!chunk.trim()) continue;

      const ttsResponse = await fetch(googleTtsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text: chunk },
          voice: {
            languageCode: voiceConfig.languageCode,
            name: voiceConfig.name,
            ssmlGender: "MALE",
          },
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: 1.0,
            pitch: -1.0, // Natural deep male resonance
          },
        }),
      });

      if (!ttsResponse.ok) {
        const errBody = await ttsResponse.text();
        console.warn("Google Cloud TTS API responded with error:", errBody);
        return NextResponse.json({
          success: false,
          fallback: true,
          cleanedText,
          error: "Google Cloud TTS failed.",
        });
      }

      const ttsData = await ttsResponse.json();
      if (ttsData.audioContent) {
        audioBuffers.push(Buffer.from(ttsData.audioContent, "base64"));
      }
    }

    if (audioBuffers.length === 0) {
      return NextResponse.json({
        success: false,
        fallback: true,
        cleanedText,
        error: "No audio generated.",
      });
    }

    // Seamlessly combine all synthesized MP3 audio chunks into a single audio track
    const combinedAudio = Buffer.concat(audioBuffers);

    return NextResponse.json({
      success: true,
      audioContent: combinedAudio.toString("base64"),
      audioEncoding: "MP3",
      cleanedText,
    });
  } catch (error: any) {
    console.error("Error in TTS route:", error);
    return NextResponse.json(
      {
        success: false,
        fallback: true,
        error: error.message || "TTS service error.",
      },
      { status: 500 }
    );
  }
}
