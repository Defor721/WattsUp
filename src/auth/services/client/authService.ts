import { AuthResponse, SocialSignupParams } from "@/auth/type";
import apiClient from "@/lib/axios";

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
export async function socialSignup(): Promise<any> {
  const { data } = await apiClient.post(
    "/api/auth/social/session",

    {
      withCredentials: true,
    },
  );

  return data;
}

/**
 * 일반 회원가입
 */
export async function nativeSignup({
  password,
}: {
  password: string;
}): Promise<any> {
  try {
    const { data } = await apiClient.post(
      "/api/auth/users",
      {
        password,
      },
      {
        withCredentials: true,
      },
    );

    return data;
  } catch (error) {
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
  corporateNumber: string,
): Promise<any> {
  try {
    const { data } = await apiClient.post("/api/auth/business-info/verify", {
      businessNumber,
      startDate,
      principalName,
      companyName,
      corporateNumber,
    });

    return data;
  } catch (error: any) {
    console.log("사업자 등록번호 확인 중 오류 발생", error);
    throw error;
  }
}
