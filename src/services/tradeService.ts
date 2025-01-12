import apiClient from "@/lib/axios";

export async function updateCredit(charge: number) {
  const { data } = await apiClient.post("/api/trade/chargecredit", {
    charge,
  });

  return data;
}

export const fetchCrawlData = async () => {
  const response = await apiClient.get("/api/crawl");
  return response.data;
};

export const fetchBid = async () => {
  const response = await apiClient.get("/api/trade/countbid");
  return response.data;
};

export const fetchSupplyData = async () => {
  const response = await apiClient.get("/api/trade/supply");
  return response.data;
};
