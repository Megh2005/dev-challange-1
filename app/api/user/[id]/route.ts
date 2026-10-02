import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ error: "Missing user ID." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    let query: any = {};
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { email: id }] };
    } else {
      query = { email: id };
    }

    const userDoc = await db.collection("user").findOne(query);

    if (!userDoc) {
      return NextResponse.json({ error: "User profile not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userDoc._id.toString(),
        name: userDoc.name || "Civil Professional",
        email: userDoc.email,
        image: userDoc.image || null,
        role: userDoc.role || "supervisor",
        createdAt: userDoc.createdAt || null,
      },
    });
  } catch (error: any) {
    console.error("Error fetching user profile by ID:", error);
    return NextResponse.json(
      { error: "Internal server error fetching user profile." },
      { status: 500 }
    );
  }
}
