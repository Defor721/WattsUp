import { AuthResponse } from "@/auth/type";
import apiClient from "@/lib/axios";

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
 * 일반 로그인
 */
export const loginWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  const response = await apiClient.post("/api/auth/session", {
    email,
    password,
  });
  const { data } = response;

  return data;
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
    throw error;
  }
}

/**
 * 소셜 로그인(회원가입)
 */
export async function socialSignup(password: string): Promise<any> {
  const { data } = await apiClient.post(
    "/api/auth/social/session",
    { password },
    {
      withCredentials: true,
    },
  );

  return data;
}

/**
 * 로그아웃
 */
export const logout = async () => {
  try {
    const { data } = await apiClient.delete("/api/auth/session", {
      withCredentials: true,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * 회원탈퇴
 */
export const deleteUser = async (password: string) => {
  try {
    const { data } = await apiClient.delete("/api/auth/users", {
      data: { password },
      withCredentials: true,
    });

    return data;
  } catch (error) {
    console.log(error);
    throw error;
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
  const { data } = await apiClient.post("/api/auth/business-info/verify", {
    businessNumber,
    startDate,
    principalName,
    companyName,
    corporateNumber,
  });

  return data;
}
