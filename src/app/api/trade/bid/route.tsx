import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const authorizationHeader = request.headers.get("Authorization");
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
    const incomeCollection = db.collection("income"); // 추가
    const users = await userCollection.findOne({ email });
    if (!users) {
      return NextResponse.json(
        { message: "Failed to find user" },
        { status: 404 },
      );
    }
    const businessNumber = users.businessNumber;

    const now = new Date();

    const dailySupply = await supplyCollection.findOne({});
    if (!dailySupply) {
      return NextResponse.json(
        { message: "Failed to find data" },
        { status: 404 },
      );
    }

    if (dailySupply[region] !== undefined) {
      if (dailySupply[region] < quantity) {
        return NextResponse.json(
          { message: "Insufficient supply for the requested price" },
          { status: 400 },
        );
      }
      const updatedSupply = await supplyCollection.updateOne(
        { _id: dailySupply._id },
        { $inc: { [`${region}`]: -quantity } },
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

    const user = await userCollection.findOne({ email });
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
      businessNumber,
      quantity,
      now,
    });

    // Income 컬렉션에 price의 2% 추가
    const commission = price * 0.02; // 2% 계산
    const updatedIncome = await incomeCollection.updateOne(
      {},
      { $inc: { total: commission } },
      { upsert: true }, // 문서가 없을 경우 새로 생성
    );

    if (updatedIncome.modifiedCount === 0 && !updatedIncome.upsertedId) {
      return NextResponse.json(
        { message: "Failed to update income value" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Successfully insert bid", result },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to process request", error: errorMessage },
      { status: 500 },
    );
  }
}
