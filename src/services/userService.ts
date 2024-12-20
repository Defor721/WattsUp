import apiClient from "@/lib/axios";

export interface CheckUserResponse {
  businessNumber: any;
  signupType: "native" | "social" | null;
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
