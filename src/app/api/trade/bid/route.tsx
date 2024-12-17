import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { userId, item, price } = await request.json();
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("bid");
    const result = await collection.insertOne({ userId, item, price });
    return NextResponse.json(
      { message: "Successfully insert bid", result },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to find data", error: errorMessage },
      { status: 500 },
    );
  }
}
