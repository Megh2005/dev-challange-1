import { NextRequest, NextResponse } from "next/server";
import { fetchSiteEnvironment } from "@/lib/raghav/weather";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const latStr = searchParams.get("lat");
    const lonStr = searchParams.get("lon");

    if (!latStr || !lonStr) {
      return NextResponse.json(
        { error: "Latitude and longitude query parameters are required." },
        { status: 400 }
      );
    }

    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);

    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json(
        { error: "Invalid latitude or longitude values." },
        { status: 400 }
      );
    }

    const data = await fetchSiteEnvironment(lat, lon);
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Failed to fetch weather: ${message}` },
      { status: 500 }
    );
  }
}
