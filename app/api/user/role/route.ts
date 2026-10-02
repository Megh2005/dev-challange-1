import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const VALID_ROLES = ["supervisor", "engineer"] as const;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = await req.json();

    if (!role || !VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Role must be supervisor or engineer." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const userId = (session.user as any).id;
    let query: any = { email: session.user.email };

    if (userId && ObjectId.isValid(userId)) {
      query = { _id: new ObjectId(userId) };
    }

    const existingUser = await db.collection("user").findOne(query);
    if (existingUser?.role) {
      return NextResponse.json(
        { error: "Role is already assigned and cannot be changed." },
        { status: 403 }
      );
    }

    await db.collection("user").updateOne(
      query,
      {
        $set: {
          role,
          roleAssignedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      role,
    });
  } catch (error) {
    console.error("Error setting user role:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
