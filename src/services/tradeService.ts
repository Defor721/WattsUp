import apiClient from "@/lib/axios";

export async function updateCredit(charge: number) {
  const { data } = await apiClient.post("/api/trade/chargecredit", {
    charge,
  });

  return data;
}

export const fetchCrawlData = async () => {
  try {
    const response = await apiClient.get("/api/crawl");

    if (!response.data) {
      throw new Error("API 응답 데이터가 없습니다.");
    }

    console.log("fetchCrawlData 응답:", response.data); // 디버깅용 로그
    return response.data;
  } catch (error) {
    console.error("fetchCrawlData 오류 발생:", error);
    return null; // API 요청 실패 시 안전한 기본값 반환
  }
};

export const fetchCountBid = async () => {
  const response = await apiClient.get("/api/trade/countbid");
  return response.data;
};

export const fetchSupplyData = async () => {
  const response = await apiClient.get("/api/trade/supply");
  return response.data;
};
