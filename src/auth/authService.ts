import apiClient from "@/lib/axios";

export const fetchCurrentUser = async (): Promise<{
  id: string;
  name: string;
}> => {
  const { data } = await apiClient.get("/users/me");
  return data;
};
