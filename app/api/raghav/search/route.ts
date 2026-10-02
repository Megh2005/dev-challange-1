import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Controlled research route prioritizing BIS, CPWD, Indian regulatory bodies,
 * and recognized civil engineering institutions for time-sensitive queries.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ summary: "", sources: [] }, { status: 400 });
  }

  // Pre-curated official reference index for standard Indian civil engineering queries
  // (BIS standards, NBC 2016, CPWD specifications, MoRTH, IS 456, IS 800, IS 1893, IS 13920)
  const standardsDirectory: Record<
    string,
    { summary: string; title: string; url: string }
  > = {
    "is 456": {
      title: "IS 456:2000 - Plain and Reinforced Concrete Code of Practice (BIS)",
      url: "https://standardsbis.bsbedge.com",
      summary:
        "IS 456:2000 governs plain and reinforced concrete in India, covering limit state design for flexure, shear, compression, and durability requirements (exposure conditions, minimum cement content, max w/c ratio).",
    },
    "is 800": {
      title: "IS 800:2007 - General Construction In Steel (BIS)",
      url: "https://standardsbis.bsbedge.com",
      summary:
        "IS 800:2007 prescribes limit state design criteria for hot-rolled steel structures, tension members, compression members, flexural members, and connections.",
    },
    "is 1893": {
      title: "IS 1893 (Part 1):2016 - Earthquake Resistant Design of Structures (BIS)",
      url: "https://standardsbis.bsbedge.com",
      summary:
        "IS 1893:2016 establishes seismic zones (II to V), zone factors, response reduction factors (R), importance factors (I), and design spectrum for earthquake-resistant building design.",
    },
    "is 13920": {
      title: "IS 13920:2016 - Ductile Design and Detailing of RC Structures (BIS)",
      url: "https://standardsbis.bsbedge.com",
      summary:
        "IS 13920:2016 outlines mandatory ductile detailing for structures in seismic zones III, IV, and V, specifying minimum column sizes, transverse hoop spacing, and beam-column joint confining reinforcement.",
    },
    "is 2502": {
      title: "IS 2502:1963 - Bending and Fixing of Bars for Concrete Reinforcement",
      url: "https://standardsbis.bsbedge.com",
      summary:
        "IS 2502 provides standard bending schedules, minimum internal bend radii (2d for mild steel, 4d for HYSD), hook dimensions, and fixing/tying practices for rebar.",
    },
    nbc: {
      title: "National Building Code of India (NBC 2016) - BIS",
      url: "https://www.bis.gov.in",
      summary:
        "NBC 2016 contains comprehensive guidelines for building safety, structural design, fire protection, and construction practices across Indian municipal jurisdictions.",
    },
    cpwd: {
      title: "CPWD Specifications 2019 / 2023 - Ministry of Housing and Urban Affairs",
      url: "https://cpwd.gov.in",
      summary:
        "CPWD specifications govern workmanship standards, material testing frequencies, mortar/concrete grades, and execution protocols for public works.",
    },
  };

  const lowerQ = q.toLowerCase();
  for (const [key, value] of Object.entries(standardsDirectory)) {
    if (lowerQ.includes(key)) {
      return NextResponse.json({
        summary: value.summary,
        sources: [
          {
            title: value.title,
            url: value.url,
            snippet: value.summary,
          },
        ],
      });
    }
  }

  // Fallback: If not matched in standards directory, state that real-time statutory amendment
  // requires project verification from official BIS or CPWD portals.
  return NextResponse.json({
    summary: `Current statutory amendment status for '${q}' requires verification against the official Bureau of Indian Standards (BIS) e-portal (standardsbis.bsbedge.com) or relevant local municipal authority gazette.`,
    sources: [
      {
        title: "Bureau of Indian Standards (BIS) Official Standards Portal",
        url: "https://standardsbis.bsbedge.com",
        snippet: "Official repository of current Indian Standards and amendments.",
      },
    ],
  });
}
