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
  // limit: number = 1,
  page: number = 1,
): Promise<{ users: Users[]; totalCount: number }> => {
  const response = await apiClient.get(
    `/api/admin/userinfo?limit=1&page=${page}`,
  );
  return response.data;
};

// 거래 정보(users, bids)
export const fetchBidLists = async () => {
  const response = await apiClient.get("/api/admin/userinfo/bidlist");
  return response.data;
};
