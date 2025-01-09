import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("wattsup");
    const incomeCollection = db.collection("income");
    const result = await incomeCollection.findOne(
      {},
      { projection: { _id: 0, total: 1 } },
    );
    return NextResponse.json(
      { message: "success to get data", result },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to process request", error: errorMessage },
      { status: 500 },
    );
  }
}
