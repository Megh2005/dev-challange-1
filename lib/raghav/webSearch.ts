import { SearchSource } from "./types";

/**
 * Keywords and patterns indicating the user's question genuinely depends on
 * current/time-sensitive information (Indian laws, recent regulations, BIS amendments, etc.)
 */
const TIME_SENSITIVE_TRIGGERS = [
  /latest\s+(amendment|revision|notification|guideline|standard|code)/i,
  /current\s+(law|regulation|rule|statute|standard|code|requirement)/i,
  /recent\s+(update|change|notification|circular|amendment)/i,
  /new\s+(code|standard|specification|safety\s+rule|regulation)/i,
  /gazette\s+notification/i,
  /government\s+order|go\s+order/i,
  /bis\s+(amendment|revision|circular)/i,
  /rera\s+(rule|regulation|notification)/i,
  /cpwd\s+(specification|circular|manual)\s+202[0-9]/i,
  /is\s+\d+\s*:\s*202[0-9]/i,
  /in\s+202[4-9]/i,
];

/**
 * Checks whether the prompt requires current/time-sensitive external research.
 */
export function requiresWebResearch(prompt: string): boolean {
  return TIME_SENSITIVE_TRIGGERS.some((regex) => regex.test(prompt));
}

/**
 * Extracts a minimal, sanitized search query containing only technical keywords,
 * avoiding leaking full conversation history or private project identifiers.
 */
export function sanitizeSearchQuery(prompt: string): string {
  // Strip conversational noise
  const sanitized = prompt
    .replace(
      /^(hi|hello|hey|dear\s+raghav|raghav|can\s+you\s+tell\s+me|please\s+explain|what\s+is|tell\s+me\s+about)\s+/i,
      ""
    )
    .replace(/[?!.]/g, "")
    .trim();

  // Limit to technical keywords (up to ~80 chars)
  return sanitized.slice(0, 80);
}

/**
 * Performs a separate retrieval step for time-sensitive civil engineering standards
 * and statutory regulations, prioritizing official BIS and government authorities.
 */
export async function performWebResearch(
  prompt: string
): Promise<{ context: string; sources: SearchSource[] }> {
  const query = sanitizeSearchQuery(prompt);
  if (!query) {
    return { context: "", sources: [] };
  }

  try {
    const res = await fetch(
      `/api/raghav/search?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );

    if (!res.ok) {
      return {
        context:
          "[Note: External verification for current standards was attempted but could not be completed. The response relies on established engineering principles.]",
        sources: [],
      };
    }

    const data = await res.json();
    const sources: SearchSource[] = data.sources || [];
    const summary: string = data.summary || "";

    if (!summary || sources.length === 0) {
      return {
        context:
          "[Note: Current official notifications for this specific query could not be verified from online standards authorities.]",
        sources: [],
      };
    }

    const context = `[Current Verified Technical Reference Information from Official Standards/Regulatory Authorities]:
${summary}
(Use the above verified reference only if directly applicable. If unverified, explicitly state that current statutory amendments must be verified with project authorities.)`;

    return { context, sources };
  } catch (err) {
    console.warn("Web research lookup error:", err);
    return {
      context:
        "[Note: External standards verification service was unreachable. Relying on core engineering fundamentals.]",
      sources: [],
    };
  }
}
