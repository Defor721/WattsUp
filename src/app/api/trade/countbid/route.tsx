import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("bid");
    const count = await collection.countDocuments();
    return NextResponse.json(
      { message: "success to count data", count },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to count data" },
      { status: 500 },
    );
  }
}
