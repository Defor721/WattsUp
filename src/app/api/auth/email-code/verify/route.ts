import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { verificationcodeKey } from "@/utils";
import { checkRedisConnection, redisClient } from "@/lib/redis";
import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { email, emailCode } = await request.json();

    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");
    const user = await collection.findOne({ email });

    if (user?.signupType === "native") {
      return NextResponse.json(
        {
          accessToken: "",
          message:
            "해당 이메일은 일반 회원으로 등록되어 있습니다. 일반 로그인을 이용해 주세요.",
        },
        { status: 409 },
      );
    }

    if (user?.signupType === "social") {
      return NextResponse.json(
        {
          accessToken: "",
          message:
            "해당 이메일은 소셜 회원으로 등록되어 있습니다. 소셜 로그인을 이용해 주세요.",
        },
        { status: 409 },
      );
    }

    if (!email || !emailCode) {
      return NextResponse.json(
        { message: "이메일과 코드를 모두 입력해야 합니다." },
        { status: 400 },
      );
    }

    await checkRedisConnection();

    const storedCode = await redisClient.get(verificationcodeKey(email));
    await redisClient.del(verificationcodeKey(email));
    if (!storedCode) {
      return NextResponse.json(
        {
          message: "인증 코드가 만료되었거나 존재하지 않습니다.",
        },
        { status: 400 },
      );
    }
    if (storedCode !== emailCode) {
      return NextResponse.json(
        { message: "인증 코드가 유효하지 않습니다." },
        { status: 400 },
      );
    }

    const emailVerificationToken = jwt.sign(
      {
        email: email,
        signupType: "native",
        provider: null,
      },
      process.env.TEMP_TOKEN_SECRET!,
      { expiresIn: "15m" },
    );

    const response = NextResponse.json(
      { message: "인증 성공" },
      { status: 200 },
    );
    response.cookies.set("emailVerificationToken", emailVerificationToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("코드 검증 중 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다.", status: "error" },
      { status: 500 },
    );
  }
}
