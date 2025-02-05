import apiClient from "@/lib/axios";
import { BidSet, BidStats } from "@/types/bid";

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
  limit: number = 5,
  page: number = 0,
  select: string,
  target?: string,
): Promise<{ userSet: Users[]; totalCount: number }> => {
  const response = await apiClient.get(
    `/api/admin/userinfo?limit=${limit}&pages=${page}&select=${select}&target=${target}`,
  );
  return response.data;
};

// 거래 데이터
export const fetchBidStats = async () => {
  const response = await apiClient.get(`/api/admin/userinfo/bidlist`);
  return response.data.stats;
};

// 거래 내역
export const fetchBidData = async (
  limit: number = 5,
  page: number = 0,
  select: string,
  target?: string,
): Promise<{ message: string; bidSet: BidSet[]; stats: BidStats }> => {
  const response = await apiClient.get(
    `/api/admin/userinfo/bidlist?limit=${limit}&pages=${page}&select=${select}&target=${target}`,
  );
  return response.data;
};
