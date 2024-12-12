import apiClient from "@/lib/axios";

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

export interface ResponsePayload {
  access_token: string | null;
  expires_in: number | null;
  user: any | null;
  message: string | null;
  requiresAdditionalData: boolean;
  redirectTo: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  redirectTo?: string;
  message?: string;
  status?: number;
}

/**
 * 일반 로그인
 */
export const loginWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  const { data } = await apiClient.post("/api/login", {
    email,
    password,
  });

  return data;
};

/**
 * 소셜 토큰 교환 서비스
 */
export async function exchangeSocialToken(code: string): Promise<AuthResponse> {
  try {
    const { data } = await apiClient.post<AuthResponse>("/api/auth/exchange", {
      authorizationCode: code,
    });

    return data;
  } catch (error) {
    console.log("소셜 토큰 교환 중 오류 발생", error);

    throw error;
  }
}

/**
 * Google에 토큰 요청
 */
export async function fetchGoogleTokens(
  authorizationCode: string,
): Promise<GoogleTokenResponse> {
  try {
    const { data } = await apiClient.post<GoogleTokenResponse>(
      "https://oauth2.googleapis.com/token",
      {
        code: authorizationCode,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
        grant_type: "authorization_code",
      },
    );

    return data;
  } catch (error) {
    console.log("소셜 토큰 요청 중 오류 발생", error);

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
