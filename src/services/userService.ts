import apiClient from "@/lib/axios";
import { changePasswordProps, findEmailProps } from "@/stores/useUserStore";

export interface CheckUserResponse {
  businessNumber: any;
  signupType: "native" | "social";
  email: string;
}

/** 이메일로 유저 조회 */
export async function checkUserByEmail(
  email: string,
): Promise<CheckUserResponse> {
  const { data } = await apiClient.post<CheckUserResponse>(
    "/api/users/registration",
    { email },
  );
  return data;
}

/** 토큰으로 유저 조회 */
export async function fetchCurrentUser() {
  const { data } = await apiClient.get("/api/users");

  return data;
}

/** 현재 비밀번호를 받아 새 비밀번호로 변경 */
export async function updatePasswordByPassword({
  currentPassword,
  newPassword,
}: changePasswordProps) {
  const { data } = await apiClient.patch(
    "/api/users/password",
    { currentPassword, newPassword },
    {
      withCredentials: true,
    },
  );

  return data;
}

/** 새 비밀번호로 변경 */
export async function updatePasswordByEmail(newPassword: string) {
  const { data } = await apiClient.patch(
    "/api/users/password/reset",
    { newPassword },
    {
      withCredentials: true,
    },
  );

  return data;
}

/** 사업자 등록번호로 이메일 조회 */
export async function getEmailByCorporateNumber({
  businessNumber,
  corporateNumber,
}: findEmailProps) {
  const { data } = await apiClient.post("/api/users/email", {
    businessNumber,
    corporateNumber,
  });

  return data;
}
