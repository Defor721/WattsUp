import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("wattsup");
    const supplyCollection = db.collection("supply");

    const result = await supplyCollection.findOne(
      {},
      { projection: { _id: 0, updatedAt: 0 } },
    );

    if (!result) {
      return NextResponse.json(
        { message: "No data found in the supply collection" },
        { status: 404 },
      );
    }

    // 지역 값들의 총합 계산
    const total = Object.values(result).reduce(
      (sum, value) => sum + (typeof value === "number" ? value : 0),
      0,
    );

    return NextResponse.json(
      {
        message: "Success to find data",
        result,
        total,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error fetching supply data:", errorMessage);

    return NextResponse.json(
      { message: "Error fetching data", error: errorMessage },
      { status: 500 },
    );
  }
}
