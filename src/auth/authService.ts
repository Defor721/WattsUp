import apiClient from "@/lib/axios";

import { User } from "./type";

export const fetchCurrentUser = async (): Promise<{
  id: string;
  name: string;
}> => {
  try {
    const { data } = await apiClient.get("/users/me");

    return data;
  } catch (error) {
    console.error("유저 조회 오류:", error);
    throw error;
  }
};

export interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  redirectTo?: string;
  message?: string;
  user?: User;
}

/** 소셜 로그인 토큰 교환 서비스 */
export async function exchangeSocialToken(code: string): Promise<AuthResponse> {
  try {
    const { data } = await apiClient.post<AuthResponse>("/api/auth/exchange", {
      authorizationCode: code,
    });

    return data;
  } catch (error) {
    console.error("소셜 토큰 교환 중 오류 발생:", error);
    throw error;
  }
}
