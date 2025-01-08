import apiClient from "@/lib/axios";
import { changePasswordProps, findEmailProps } from "@/stores/useUserStore";

export interface CheckUserResponse {
  businessNumber: any;
  signupType: "native" | "social";
  email: string;
}

export async function checkUserByEmail(
  email: string,
): Promise<CheckUserResponse> {
  const { data } = await apiClient.post<CheckUserResponse>(
    "/api/users/registration",
    { email },
  );
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get("/api/users");

  return data;
}

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
