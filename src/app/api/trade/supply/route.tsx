import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("wattsup");

    const today = new Date();
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth() + 1;
    const day = today.getUTCDate();
    const supplyCollection = db.collection("supply");
    const result = await supplyCollection.findOne({
      $expr: {
        $and: [
          { $eq: [{ $year: "$Date" }, year] },
          { $eq: [{ $month: "$Date" }, month] },
          { $eq: [{ $dayOfMonth: "$Date" }, day] },
        ],
      },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Failed to find data" },
        { status: 404 },
      );
    } else {
      return NextResponse.json(
        { message: "Success to find data", result },
        { status: 200 },
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
