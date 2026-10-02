import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const WEATHER_API_KEY =
  process.env.NEXT_PUBLIC_WEATHER_API_KEY ||
  process.env.WEATHER_API_KEY ||
  "";

const VISION_MODELS = [
  "gemini-3.5-flash-lite",
];

// Helper to fetch live site weather from OpenWeather API using real coordinates
async function fetchSiteWeather(lat?: number, lon?: number, city?: string) {
  if (!WEATHER_API_KEY) return null;
  try {
    let url = "";
    if (typeof lat === "number" && typeof lon === "number") {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    } else if (city && city.trim()) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city.trim()
      )}&appid=${WEATHER_API_KEY}&units=metric`;
    } else {
      return null;
    }

    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      temp: Math.round(data.main?.temp || 0),
      feelsLike: Math.round(data.main?.feels_like || 0),
      humidity: data.main?.humidity || 0,
      windSpeed: Math.round((data.wind?.speed || 0) * 3.6), // Convert m/s to km/h
      condition: data.weather?.[0]?.main || "Clear",
      description: data.weather?.[0]?.description || "",
      cityName: data.name || "Field Site",
    };
  } catch (err) {
    console.warn("Weather fetch skipped:", err);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { imageBase64, mimeType = "image/jpeg", trade = "general", lat, lon, city } =
      await req.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: "A clear site photo is required for visual inspection." },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Inspection AI service is currently unavailable. (Missing GEMINI_API_KEY)" },
        { status: 500 }
      );
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    // Fetch real site environmental context
    const weather = await fetchSiteWeather(lat, lon, city);

    const weatherContextText = weather
      ? `CURRENT SITE WEATHER at ${weather.cityName}: Temperature ${weather.temp}°C (Feels like ${weather.feelsLike}°C), Humidity ${weather.humidity}%, Wind ${weather.windSpeed} km/h, Condition: ${weather.condition} (${weather.description}).`
      : "Site weather context not available.";

    const prompt = `You are SiteVision Quality Auditor, an expert Indian civil engineering quality inspector and practical field mentor.

Analyze this construction site photo. The reported trade category is: "${trade.toUpperCase()}".
${weatherContextText}

INDIAN STANDARDS (IS CODES) TO APPLY:
- Rebar & Concrete: IS 456:2000 (Cover blocks Table 16, stirrup spacing, lap length, honeycombing, compaction, cold joints).
- Hot/Cold Weather Concreting: IS 7861 (Part 1 & 2) - Curing, thermal cracks, plastic shrinkage.
- Scaffolding & Heights: IS 3696 / IS 4014 / BOCW Act (Props, baseplates, bracing, safety harness 100% tie-off).
- Brickwork & Masonry: IS 1905 / IS 2212 (Plumb level, mortar thickness 10-12mm, bond alignment).
- Personal Protective Equipment (PPE): IS 2925 (Helmet), IS 3521 (Harness), IS 15298 (Safety shoes).

INSTRUCTIONS:
1. Examine the image carefully for craftsmanship, alignment, cover, ties, honeycombing, cracks, safety, and IS code compliance.
2. Produce a JSON response strictly in clear, professional ENGLISH matching this schema with NO markdown ticks around it:
{
  "status": "PASS" | "NEEDS_ATTENTION" | "CRITICAL_FAIL",
  "title": "Clear concise English headline (e.g. Missing Bottom Cover Blocks, Severe Honeycombing Voids, Reinforcement Spacing Approved)",
  "summary": "2-3 short, clear sentences in plain English for the site worker. Explain clearly what is observed and what must be corrected immediately.",
  "correctiveSteps": [
    "Step 1: Short practical physical action to take on site",
    "Step 2: Short practical physical action to take on site"
  ],
  "goodPoints": [
    "One or two craftsmanship points observed done well in the photo"
  ],
  "engineerAudit": {
    "defectType": "Formal engineering defect name (or 'No Major Defect' if pass)",
    "isCodeRef": "Exact Indian Standard reference (e.g. IS 456:2000 Table 16 / IS 3696 Part 1)",
    "severity": "Low" | "Medium" | "High",
    "technicalRootCause": "Engineering explanation of why this happened and structural risk",
    "actionRequired": "Technical rectification mandatory before engineer sign-off"
  },
  "weatherPrecaution": "If weather is extreme (temp > 35C, high wind, rain), give 1 specific precaution in English. Otherwise leave as empty string."
}`;

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    let resultText = "";
    let lastError: any = null;

    for (const modelName of VISION_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        });

        const response = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          },
        ]);

        const text = response.response.text();
        if (text) {
          resultText = text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Vision model ${modelName} failed, attempting next model:`, err.message);
      }
    }

    if (!resultText) {
      throw lastError || new Error("Failed to analyze image with vision models.");
    }

    const cleanedJson = resultText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedData = JSON.parse(cleanedJson);

    // Persist real audit record to MongoDB
    let auditId = `aud-${Date.now()}`;
    try {
      const client = await clientPromise;
      const db = client.db();
      const insertResult = await db.collection("site_inspections").insertOne({
        trade,
        status: parsedData.status,
        title: parsedData.title,
        summary: parsedData.summary,
        correctiveSteps: parsedData.correctiveSteps || [],
        goodPoints: parsedData.goodPoints || [],
        engineerAudit: parsedData.engineerAudit || {},
        weatherPrecaution: parsedData.weatherPrecaution || "",
        weather,
        createdAt: new Date(),
      });
      auditId = insertResult.insertedId.toString();
    } catch (dbErr) {
      console.warn("MongoDB inspection persistence skipped:", dbErr);
    }

    return NextResponse.json({
      success: true,
      auditId,
      trade,
      weather,
      inspection: parsedData,
    });
  } catch (error: any) {
    console.error("Error in SiteVision inspect route:", error);
    return NextResponse.json(
      {
        error:
          error.message ||
          "Could not analyze image. Please ensure photo is clear and try again.",
      },
      { status: 500 }
    );
  }
}
