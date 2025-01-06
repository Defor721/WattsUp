import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import clientPromise from "@/lib/mongodb";
import {
  fetchGoogleTokens,
  fetchGoogleUserInfo,
} from "@/auth/services/server/authService";

// 환경 변수 검증 함수
const validateEnv = () => {
  if (
    !process.env.ACCESS_TOKEN_SECRET ||
    !process.env.REFRESH_TOKEN_SECRET ||
    !process.env.TEMP_TOKEN_SECRET ||
    !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.NEXT_PUBLIC_REDIRECT_URI
  ) {
    throw new Error("환경 변수가 설정되지 않았습니다.");
  }
};

/** 구글 토큰 교환 */
export async function POST(request: NextRequest) {
  try {
    validateEnv();

    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");
    const { authorizationCode } = await request.json();

    if (!authorizationCode) {
      return NextResponse.json(
        {
          message: "Authorization code가 없습니다.",
          redirectTo: "/login",
        },
        { status: 400 },
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
    // Google에서 토큰 요청
    const { access_token } = await fetchGoogleTokens(authorizationCode);

    // Google에서 유저 정보 요청
    const googleUser = await fetchGoogleUserInfo(access_token);

    // DB에서 유저 확인
    const user = await collection.findOne({ email: googleUser.email });

    // 일반 유저 분기 처리
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

    // 이미 회원가입 완료된 계정: 임시 토큰 반환
    if (user?.businessNumber) {
      const payload = { email: user.email };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: "7d" },
      );

      // DB에 리프레시 토큰 저장
      await collection.updateOne(
        { email: user.email },
        { $set: { refreshToken, updatedAt: new Date() } },
      );

      const response = NextResponse.json(
        { message: "로그인 성공", accessToken },
        { status: 201 },
      );
      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "none",
      });
      return response;
    }

    // 추가 정보 입력이 필요한 경우: 임시 토큰 반환
    const emailVerificationToken = jwt.sign(
      {
        email: googleUser.email,
        signupType: "social",
        provider: "google",
      },
      process.env.TEMP_TOKEN_SECRET!,

      { expiresIn: "15m" },
    );

    const response = NextResponse.json(
      { message: "추가 정보 입력이 필요합니다." },
      { status: 201 },
    );

    response.cookies.set("emailVerificationToken", emailVerificationToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message: `${error || "내부 서버 오류가 발생했습니다."}`,
      },
      { status: 500 },
    );
  }
}
