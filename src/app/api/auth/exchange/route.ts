import { NextRequest, NextResponse } from "next/server";

import { checkUserInDatabase } from "@/services/userService";
import { fetchGoogleTokens, fetchGoogleUserInfo } from "@/auth/authService";
import { NULL_RESPONSE_PAYLOAD } from "@/constants/nullObject";

export async function POST(request: NextRequest) {
  try {
    const { authorizationCode } = await request.json();

    if (!authorizationCode) {
      return NextResponse.json(
        {
          ...NULL_RESPONSE_PAYLOAD,
          message: "Authorization code가 없습니다.",
          redirectTo: "/login",
        },
        { status: 400 },
      );
    }

    // Google에서 토큰 요청
    const { access_token, refresh_token, expires_in } =
      await fetchGoogleTokens(authorizationCode);

    // Google에서 유저 정보 요청
    const userInfo = await fetchGoogleUserInfo(access_token);

    // DB에서 유저 확인
    const { signupType } = await checkUserInDatabase(userInfo.email);

    // 일반 유저 분기 처리
    if (signupType === "native") {
      return NextResponse.json(
        {
          ...NULL_RESPONSE_PAYLOAD,
          message:
            "해당 이메일은 일반 회원으로 등록되어 있습니다. 일반 로그인을 이용해 주세요.",
          redirectTo: "/login",
        },
        { status: 409 },
      );
    }

    // 로그인 성공 응답
    const response = NextResponse.json({
      ...NULL_RESPONSE_PAYLOAD,
      access_token,
      expires_in,
    });

    // HttpOnly 쿠키로 리프레쉬 토큰 설정
    response.cookies.set("refresh_token", refresh_token, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("auth exchange 로직에서 에러 발생:", error);
    return new Response(
      JSON.stringify({
        message: "내부 서버 오류가 발생했습니다.",
        redirectTo: "/login",
      }),
      { status: 500 },
    );
  }
}
