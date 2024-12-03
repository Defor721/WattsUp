import axios from "axios";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  if (!code) {
    return new Response(
      JSON.stringify({ error: "Authorization code is missing" }),
      { status: 400 }
    );
  }

  try {
    // Google API에 Access Token 요청
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI, // 리디렉션 URI와 동일해야 함
        grant_type: "authorization_code",
      }
    );

    console.log(`tokenResponse: `, tokenResponse.data);

    const { access_token } = tokenResponse.data;

    // Access Token으로 사용자 정보 요청
    const userInfoResponse = await axios.get(
      "https://openidconnect.googleapis.com/v1/userinfo?alt=json",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const userInfo = userInfoResponse.data;

    return new Response(
      JSON.stringify({ user: userInfo, token: access_token }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error exchanging code:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch Access Token" }),
      { status: 500 }
    );
  }
}
