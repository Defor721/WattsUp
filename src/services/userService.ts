import apiClient from "@/lib/axios";

export interface CheckUserResponse {
  isAdditionalInfoRequired: boolean;
  signupType: "native" | "social" | null;
}

export async function checkUserInDatabase(
  email: string,
): Promise<CheckUserResponse> {
  try {
    const { data } = await apiClient.post<CheckUserResponse>(
      "/api/users/registration",
      { email },
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
