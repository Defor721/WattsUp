import apiClient from "@/lib/axios";

interface Users {
  businessNumber: number;
  companyName: string;
  corporateNumber: number;
  createdAt: string;
  email: string;
  name: string;
  provider: null | "google";
  signupType: string;
}

// 유저 정보(users)
export const fetchUserInfo = async (
  limit: number,
  page: number = 0,
): Promise<{ userSet: Users[]; totalCount: number }> => {
  const response = await apiClient.get(
    `/api/admin/userinfo?limit=${limit}&pages=${page}`,
  );
  return response.data;
};

// 거래 정보(users, bids)
export const fetchBidLists = async () => {
  const response = await apiClient.get("/api/admin/userinfo/bidlist");
  return response.data;
};
