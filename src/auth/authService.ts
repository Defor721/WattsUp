import axios, { AxiosError } from "axios";

import apiClient from "@/lib/axios";

import { ResponsePayload } from "./type";

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

/**
 * 소셜 토큰 교환 서비스
 */
export async function exchangeSocialToken(
  code: string,
): Promise<ResponsePayload> {
  try {
    // API 요청
    const { data } = await apiClient.post<ResponsePayload>(
      "/api/auth/exchange",
      {
        authorizationCode: code,
      },
    );

    return data; // 응답 반환
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const apiError = error as AxiosError<ResponsePayload>;

      // **409 오류 반환 처리**
      if (apiError.response?.status === 409) {
        console.warn("409 오류 발생:", apiError.response.data.message);
        return apiError.response.data;
      }
    }

    console.error("API 오류 발생:", error);
    throw new Error("로그인 실패");
  }
}

/**
 * Google에 토큰 요청
 */
export async function fetchGoogleTokens(
  authorizationCode: string,
): Promise<GoogleTokenResponse> {
  const response = await apiClient.post<GoogleTokenResponse>(
    "https://oauth2.googleapis.com/token",
    {
      code: authorizationCode,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
      grant_type: "authorization_code",
    },
  );

  return response.data;
}

/**
 * Google에 사용자 정보 요청
 */
export async function fetchGoogleUserInfo(accessToken: string): Promise<any> {
  const response = await apiClient.get(
    "https://openidconnect.googleapis.com/v1/userinfo",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  return response.data;
}
