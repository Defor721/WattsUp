import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("tradedata");
    try {
      const data = await collection
        .find({}, { projection: { _id: 0 } })
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
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to count data" },
      { status: 500 },
    );
  }
}
