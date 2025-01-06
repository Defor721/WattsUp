import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

//입찰 api

export async function POST(request: NextRequest) {
  try {
    const { region, price } = await request.json();
    const client = await clientPromise;
    const db = client.db("wattsup");
    const bidCollection = db.collection("bid");
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth() + 1;
    const day = today.getUTCDate();
    const supplyCollection = db.collection("supply");
    const dailySupply = await supplyCollection.findOne({
      $expr: {
        $and: [
          { $eq: [{ $year: "$Date" }, year] },
          { $eq: [{ $month: "$Date" }, month] },
          { $eq: [{ $dayOfMonth: "$Date" }, day] },
        ],
      },
    });
    if (!dailySupply) {
      return NextResponse.json(
        { message: "Failed to find data" },
        { status: 404 },
      );
    }
    if (dailySupply[region] !== undefined) {
      // 해당 region 필드가 존재하는지 확인 후 업데이트
      if (dailySupply[region] < price) {
        return NextResponse.json(
          { message: "Insufficient supply for the requested price" },
          { status: 400 },
        );
      }

      const updatedSupply = await supplyCollection.updateOne(
        { _id: dailySupply._id }, // 해당 문서의 _id로 조건 설정
        { $inc: { [`${region}`]: -price } }, // region 값을 동적으로 설정하여 price 차감
      );

      if (updatedSupply.modifiedCount === 0) {
        return NextResponse.json(
          { message: "Failed to update supply value" },
          { status: 500 },
        );
      }
    } else {
      return NextResponse.json(
        { message: `Region ${region} not found in supply data` },
        { status: 404 },
      );
    }

    const result = await bidCollection.insertOne({ region, price });
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
