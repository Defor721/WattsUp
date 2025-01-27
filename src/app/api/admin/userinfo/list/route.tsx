import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");
    const offset = parseInt(request.nextUrl.searchParams.get("offset") || "0");
    const users = await collection
      .find({})
      .project({ _id: 0, password: 0, refreshToken: 0 })
      .skip(offset)
      .limit(limit)
      .toArray();
    return NextResponse.json({ message: "success", users }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to find data", error: errorMessage },
      { status: 500 },
    );
  }
}
