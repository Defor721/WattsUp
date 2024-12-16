import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  //일반 로그인
  try {
    const { email, password }: { email: string; password: string } =
      await request.json();
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");
    const user = await collection.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (user.password === password) {
      const payload = { email: email };
      const accessSecret = process.env.ACCESS_TOKEN_SECRET as string;
      const accessToken = jwt.sign(payload, accessSecret, { expiresIn: "1h" });
      const refreshSecret = process.env.REFRESH_TOKEN_SECRET as string;
      const refreshToken = jwt.sign(payload, refreshSecret, {
        expiresIn: "7d",
      });
      await collection.updateOne(
        { email },
        { $set: { refreshToken: refreshToken } },
      );
      const response = NextResponse.json(
        { message: "Login Successfully", accessToken },
        { status: 201 },
      );
      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
        sameSite: "none",
      });
      return response;
    } else {
      return NextResponse.json(
        { message: "Password invalid" },
        { status: 401 },
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

export async function DELETE() {}
