import { NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: { businessNumber: string } },
) {
  try {
    const { businessNumber } = params; // params는 비동기 접근이 필요하지 않음

    if (!businessNumber) {
      return NextResponse.json(
        { message: "Business number is missing" },
        { status: 400 },
      );
    }
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("bid");

    const bidList = await collection
      .find({ businessNumber: Number(businessNumber) })
      .toArray();

    if (bidList.length === 0) {
      return NextResponse.json(
        { message: `No data found for business number: ${businessNumber}` },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Data retrieved successfully", bidList },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Error occurred during data fetch:", errorMessage);

    return NextResponse.json(
      { message: "Failed to retrieve data", error: errorMessage },
      { status: 500 },
    );
  }
}
