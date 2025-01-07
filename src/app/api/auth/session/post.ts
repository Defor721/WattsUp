import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
      return NextResponse.json(
        {
          message:
            "아이디 또는 비밀번호가 잘못 되었습니다. 아이디와 비밀번호를 정확히 입력해 주세요.",
        },
        { status: 400 },
      );
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      const payload = { email: email };
      const accessSecret = process.env.ACCESS_TOKEN_SECRET as string;
      const accessToken = jwt.sign(payload, accessSecret, { expiresIn: "1h" });
      const refreshSecret = process.env.REFRESH_TOKEN_SECRET as string;
      const refreshToken = jwt.sign(payload, refreshSecret, {
        expiresIn: "7d",
      });
      await collection.updateOne(
        { email },
        { $set: { refreshToken: refreshToken, updatedAt: new Date() } },
      );
      const response = NextResponse.json(
        { message: "로그인 성공", accessToken },
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
        {
          message:
            "아이디 또는 비밀번호가 잘못 되었습니다. 아이디와 비밀번호를 정확히 입력해 주세요.",
        },
        { status: 400 },
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
