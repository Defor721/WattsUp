import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { verificationcodeKey } from "@/utils";
import { checkRedisConnection, redisClient } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const { email, emailCode } = await request.json();

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
          message: "해당 인증코드는 만료되었거나 존재하지 않습니다.",
        },
        { status: 400 },
      );
    }
    if (storedCode !== emailCode) {
      return NextResponse.json(
        { message: "인증코드가 유효하지 않습니다." },
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
      { message: "이메일 인증을 완료했습니다." },
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
