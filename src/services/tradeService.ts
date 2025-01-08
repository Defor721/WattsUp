import apiClient from "@/lib/axios";

export async function updateCredit(charge: string) {
  const { data } = await apiClient.post("/api/trade/chargecredit", {
    charge,
  });

  return data;
}
