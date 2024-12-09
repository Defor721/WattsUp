import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("learningdata");
    try {
      const data = await collection
        .find({}, { projection: { _id: 0, amgo: 1 } })
        .toArray();
      return NextResponse.json(
        { message: "success to find data", data },
        { status: 200 },
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Failed to find Data" },
        { status: 500 },
      );
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to find data", error: errorMessage },
      { status: 500 },
    );
  }
}
