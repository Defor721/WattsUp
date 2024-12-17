import apiClient from "@/lib/axios";

export interface CheckUserResponse {
  isAdditionalInfoRequired: boolean;
  signupType: "native" | "social" | null;
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
  try {
    const { data } = await apiClient.get("/api/users");

    const { id, email } = data;
    return { id, email };
  } catch (error) {
    console.log("현재 유저 데이터 가져오는 중 오류 발생", error);

    throw error;
  }
}
