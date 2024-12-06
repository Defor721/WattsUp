import { NextRequest } from "next/server";

import axios from "axios";

export async function POST(request: NextRequest) {
  const { authorizationCode } = await request.json();

  if (!authorizationCode) {
    return new Response(
      JSON.stringify({ error: "Authorization code is missing" }),
      { status: 400 }
    );
  }

  try {
    // Google API에 Token 요청
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code: authorizationCode,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
        grant_type: "authorization_code",
      }
    );
    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `refresh_token=${refresh_token}; HttpOnly; Secure; Path=/; SameSite=Strict`
    );

    // Access Token으로 사용자 정보 요청
    const userInfoResponse = await axios.get(
      "https://openidconnect.googleapis.com/v1/userinfo?alt=json",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const userInfo = userInfoResponse.data;

    return new Response(
      JSON.stringify({
        user: userInfo,
        access_token: access_token,
        expires_in: expires_in,
      }),
      { headers, status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}
