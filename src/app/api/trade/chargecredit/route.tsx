import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
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
        { message: "Failed to Decode or Invalid Token" },
        { status: 403 },
      );
    }
    const email = (decoded as { email: string }).email;
    const { charge } = await request.json();
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");
    const result = await collection.updateOne(
      { email },
      { $inc: { credit: charge } },
    );
    if (result.modifiedCount > 0) {
      return NextResponse.json({ message: "success" }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "failed to update credit" },
        { status: 403 },
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
