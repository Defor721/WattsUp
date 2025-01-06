import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { userId, item, price } = await request.json();
    const client = await clientPromise;
    const db = client.db("wattsup");
    const bidCollection = db.collection("bid");
    const supplyCollection = db.collection("supply");
    // const today = new Date();
    // const dailySupply = await supplyCollection.findOne({ date: today });
    // if (dailySupply && typeof dailySupply.supply === "number") {
    //   const updatedSupply = dailySupply.supply - price;
    //   const updateResult = await supplyCollection.updateOne(
    //     { _id: dailySupply._id },
    //     { $set: { supply: updatedSupply } },
    //   );
    // } else {
    //   return NextResponse.json(
    //     { message: "Invalid input data" },
    //     { status: 400 },
    //   );
    // }
    const result = await bidCollection.insertOne({ userId, item, price });
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
