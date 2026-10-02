import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CLOUD_SPEECH_API =
  process.env.CLOUD_SPEECH_API ||
  process.env.NEXT_PUBLIC_CLOUD_SPEECH_API ||
  "";

import { SUPPORTED_LANGUAGES } from "@/lib/languages";

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required for translation." }, { status: 400 });
    }

    if (!targetLang || typeof targetLang !== "string") {
      return NextResponse.json({ error: "targetLang is required." }, { status: 400 });
    }

    const isValidLang = SUPPORTED_LANGUAGES.some((l) => l.code === targetLang);
    if (!isValidLang) {
      return NextResponse.json(
        { error: "Target language must be one of: en, hi, bn, ta, ml." },
        { status: 400 }
      );
    }

    if (!CLOUD_SPEECH_API) {
      return NextResponse.json(
        { error: "Translation API key is not configured." },
        { status: 500 }
      );
    }

    // Call Google Cloud Translation API v2
    const url = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(
      CLOUD_SPEECH_API
    )}`;

    const translateRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        format: "text",
      }),
    });

    if (!translateRes.ok) {
      const errText = await translateRes.text();
      console.error("Google Cloud Translate error:", errText);
      return NextResponse.json(
        { error: "Failed to translate with Google Translate API." },
        { status: 502 }
      );
    }

    const data = await translateRes.json();
    const rawTranslated = data?.data?.translations?.[0]?.translatedText;

    if (!rawTranslated) {
      return NextResponse.json(
        { error: "No translation received." },
        { status: 500 }
      );
    }

    // Decode HTML entities commonly returned by Google Translate v2
    const translatedText = rawTranslated
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");

    return NextResponse.json({
      success: true,
      translatedText,
      targetLang,
    });
  } catch (error: any) {
    console.error("Error in translation route:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error translating text." },
      { status: 500 }
    );
  }
}
