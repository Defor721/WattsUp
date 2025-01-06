import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

import clientPromise from "@/lib/mongodb";

// 유저 거래기록 불러오는 api

export async function GET(request: NextRequest) {
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
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");

    const userData = await collection.findOne(
      { email },
      {
        projection: {
          NumberOfTransaction: 1,
          AveragePrice: 1,
          SuccessRate: 1,
        },
      },
    );
    if (!userData) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Success to find user", userData },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to process request", error: errorMessage },
      { status: 500 },
    );
  }
}
