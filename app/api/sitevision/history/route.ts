import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const audits = await db
      .collection("site_inspections")
      .find({})
      .sort({ createdAt: -1 })
      .limit(30)
      .toArray();

    return NextResponse.json({
      success: true,
      audits: audits.map((a) => ({
        id: a._id.toString(),
        trade: a.trade,
        status: a.status,
        title: a.title,
        summary: a.summary,
        correctiveSteps: a.correctiveSteps || [],
        goodPoints: a.goodPoints || [],
        engineerAudit: a.engineerAudit || {},
        weather: a.weather || null,
        createdAt: a.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching site inspections:", error);
    return NextResponse.json(
      { error: "Failed to retrieve site inspection history." },
      { status: 500 }
    );
  }
}
