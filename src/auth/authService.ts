import apiClient from "@/lib/axios";

import { AuthResponse, GoogleTokenResponse, SocialSignupParams } from "./type";

/**
 * 일반 로그인
 */
export const loginWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  try {
    const { data } = await apiClient.post("/api/auth/session", {
      email,
      password,
    });

    return data;
  } catch (error) {
    console.log("일반 로그인 중 오류 발생", error);

    throw error;
  }
};

/**
 *  소셜 로그인(소셜 토큰 교환)
 */
export async function exchangeSocialToken(code: string): Promise<AuthResponse> {
  try {
    const { data } = await apiClient.post<AuthResponse>(
      "/api/auth/social/exchange",
      {
        authorizationCode: code,
      },
    );

    return data;
  } catch (error) {
    console.log("소셜 토큰 교환 중 오류 발생", error);

    throw error;
  }
}

/**
 * 소셜 로그인(회원가입)
 */
export async function socialSignup({
  businessNumber,
  startDate,
  pricipalName,
  companyName,
  businessType,
  corporateNumber,
  personalId,
}: SocialSignupParams): Promise<any> {
  try {
    const { data } = await apiClient.post(
      "/api/auth/social/session",
      {
        businessNumber,
        startDate,
        pricipalName,
        companyName,
        businessType,
        corporateNumber,
        personalId,
      },
      {
        withCredentials: true,
      },
    );

    return data;
  } catch (error) {
    console.log("추가정보를 입력받아 소셜 로그인 중 오류 발생", error);

    throw error;
  }
}

/**
 * 로그아웃
 */
export const logout = async () => {
  try {
    await apiClient.delete("/api/logout");
  } catch (error) {
    console.error("로그아웃 실패:", error);
  }
};

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

/**
 * 엑세스 및 리프레시 토큰 재발급
 */
export async function reissueToken(): Promise<any> {
  try {
    const { data } = await apiClient.post("/api/auth/token", {
      withCredentials: true,
    });

    return data;
  } catch (error) {
    console.log("토큰 재발급 중 오류 발생", error);
    throw error;
  }
}

/**
 * 사업자등록정보 상태조회
 */
export async function businessstatus(businessNumber: string): Promise<any> {
  try {
    const { data } = await apiClient.post("/api/auth/business-info/status", {
      businessNumber,
    });
    return data;
  } catch (error: any) {
    console.log("사업자 등록번호 확인 중 오류 발생", error);
    throw error;
  }
}

/**
 * 사업자등록정보 진위확인
 */
export async function businessInfoVerification(
  businessNumber: string,
  startDate: string,
  principalName: string,
  companyName: string,
): Promise<any> {
  try {
    const { data } = await apiClient.post("/api/auth/business-info/verify", {
      businessNumber,
      startDate,
      principalName,
      companyName,
    });

    return data;
  } catch (error: any) {
    console.log("사업자 등록번호 확인 중 오류 발생", error);
    throw error;
  }
}
