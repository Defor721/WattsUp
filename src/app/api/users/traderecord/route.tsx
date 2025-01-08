import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

import clientPromise from "@/lib/mongodb";

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
    const collection = db.collection("bid");

    const bidData = await collection
      .find(
        { email },
        {
          projection: {
            _id: 0,
          },
        },
      )
      .toArray();

    if (!bidData || bidData.length === 0) {
      return NextResponse.json(
        { message: "No records found" },
        { status: 404 },
      );
    }

    // price 합, quantity 합, 문서 개수 계산
    const totalPrice = bidData.reduce(
      (sum, item) => sum + (item.price || 0),
      0,
    );
    const totalQuantity = bidData.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0,
    );
    const documentCount = bidData.length;

    return NextResponse.json(
      {
        message: "Success to find user",
        bidData,
        stats: {
          totalPrice,
          totalQuantity,
          documentCount,
        },
      },
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
