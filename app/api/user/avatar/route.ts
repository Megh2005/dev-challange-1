import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let imageUrl = searchParams.get("url");

    if (!imageUrl) {
      const session = await getServerSession(authOptions);
      imageUrl = session?.user?.image || null;

      if (!imageUrl && session?.user?.email) {
        const client = await clientPromise;
        const db = client.db();
        const userDoc = await db.collection("user").findOne({ email: session.user.email });
        imageUrl = userDoc?.image || null;
      }
    }

    if (!imageUrl) {
      return new NextResponse("Avatar not found", { status: 404 });
    }

    const imageRes = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    if (!imageRes.ok) {
      return new NextResponse("Failed to fetch avatar", { status: imageRes.status });
    }

    const contentType = imageRes.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await imageRes.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
        "Cross-Origin-Resource-Policy": "cross-origin",
      },
    });
  } catch (error) {
    console.error("Avatar proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
