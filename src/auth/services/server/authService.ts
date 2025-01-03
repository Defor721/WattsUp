import apiClient from "@/lib/axios";

import { GoogleTokenResponse } from "../../type";

/**
 * Google에 토큰 요청
 */
export async function fetchGoogleTokens(
  authorizationCode: string,
): Promise<GoogleTokenResponse> {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: authorizationCode,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Google tokens: ${response.statusText}`);
    }

    return (await response.json()) as GoogleTokenResponse;
  } catch (error) {
    throw error;
  }
}

/**
 * Google에 사용자 정보 요청
 */
export async function fetchGoogleUserInfo(accessToken: string): Promise<any> {
  try {
    const { data } = await apiClient.get(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    return data;
  } catch (error) {
    console.log("Google에 사용자 정보 요청 중 오류 발생", error);

    throw error;
  }
}
