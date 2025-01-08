import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import clientPromise from "@/lib/mongodb";

/** 크레딧 충전 */
export async function POST(request: NextRequest) {
  try {
    const { charge, businessNumber } = await request.json();
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");
    const result = await collection.updateOne(
      { businessNumber },
      { $inc: { credit: charge } },
    );
    if (result.modifiedCount > 0) {
      return NextResponse.json({ message: "success" }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "failed to update credit" },
        { status: 403 },
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
