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
        { message: "Failed to Decode or Invalid Token" },
        { status: 403 },
      );
    }

    const email = (decoded as { email: string }).email;
    if (!email) {
      return NextResponse.json(
        { message: "Email Missing in Token" },
        { status: 403 },
      );
    }

    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");

    const user = await collection.findOne(
      { email },
      { projection: { credit: 1, _id: 0 } },
    );

    if (!user) {
      console.error(`User not found for email: ${email}`);
      return NextResponse.json(
        { message: `No records found for email: ${email}` },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "User data found successfully",
        credits: user.credit,
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
