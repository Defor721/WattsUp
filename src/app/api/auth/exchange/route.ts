import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  const { authorizationCode } = await request.json();

  if (!authorizationCode) {
    return NextResponse.json(
      { error: "Authorization code is missing" },
      { status: 400 },
    );
  }

  try {
    // Google API에 토큰 요청
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code: authorizationCode,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
        grant_type: "authorization_code",
      },
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // 사용자 정보 요청
    const userInfoResponse = await axios.get(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    const userInfo = userInfoResponse.data;

    // 사용자 확인
    const checkUserInfoResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/checkUserInfo`,
      { email: userInfo.email },
    );

    const { isAdditionalInfoRequired, provider } = checkUserInfoResponse.data;

    if (provider === "native") {
      return NextResponse.json(
        {
          message: "일반 회원으로 등록된 이메일입니다. 로그인해 주세요.",
          redirectTo: "/login",
        },
        { status: 409 },
      );
    }

    if (isAdditionalInfoRequired) {
      return NextResponse.json(
        {
          requiresRedirect: true,
          redirectTo: "/login/additional",
        },
        { status: 200 },
      );
    }

    // 이미 등록된 소셜 로그인 사용자의 응답
    const response = NextResponse.json({
      user: userInfo,
      access_token,
      expires_in,
    });

    response.cookies.set("refresh_token", refresh_token, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("auth exchange 로직에서 에러가 발생했습니다:", error);
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}
