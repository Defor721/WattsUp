import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const authorizationHeader = request.headers.get("Authorization");
    console.log(request.headers);
    if (!authorizationHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Token Invalid or Missing" },
        { status: 403 },
      );
    }
    const token = authorizationHeader.split(" ")[1]?.trim();
    if (!token) {
      return NextResponse.json({ message: "Token Missing" }, { status: 403 });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return NextResponse.json({ message: "Token Expired" }, { status: 401 });
      }
      return NextResponse.json(
        { message: "Failed to Decode or Token Expired" },
        { status: 403 },
      );
    }
    const email = (decoded as { email: string }).email;
    const { region, quantity, price } = await request.json();
    const client = await clientPromise;
    const db = client.db("wattsup");
    const bidCollection = db.collection("bid");
    const userCollection = db.collection("userdata");
    const supplyCollection = db.collection("supply");
    const now = new Date();
    const dailySupply = await supplyCollection.findOne({});

    if (!dailySupply) {
      return NextResponse.json(
        { message: "Failed to find data" },
        { status: 404 },
      );
    }
    if (dailySupply[region] !== undefined) {
      // 해당 region 필드가 존재하는지 확인 후 업데이트
      if (dailySupply[region] < quantity) {
        return NextResponse.json(
          { message: "Insufficient supply for the requested price" },
          { status: 400 },
        );
      }
      const updatedSupply = await supplyCollection.updateOne(
        { _id: dailySupply._id }, // 해당 문서의 _id로 조건 설정
        { $inc: { [`${region}`]: -quantity } }, // region 값을 동적으로 설정하여 price 차감
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
    const user = await userCollection.findOne({
      email: email,
    });
    if (!user) {
      return NextResponse.json(
        { message: "Failed to find user" },
        { status: 404 },
      );
    }
    if (user.credit !== undefined) {
      if (user.credit < price) {
        return NextResponse.json(
          { message: "Not enough credit" },
          { status: 403 },
        );
      }
      const updatedCredit = await userCollection.updateOne(
        { _id: user._id },
        { $inc: { credit: -price } },
      );
      if (updatedCredit.modifiedCount === 0) {
        return NextResponse.json(
          { message: "Failed to update credit value" },
          { status: 500 },
        );
      }
    }
    const result = await bidCollection.insertOne({
      email,
      region,
      price,
      quantity,
      now,
    });
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
