import apiClient from "@/lib/axios";

export async function updateCredit(charge: number) {
  const { data } = await apiClient.post("/api/trade/chargecredit", {
    charge,
  });

  return data;
}
