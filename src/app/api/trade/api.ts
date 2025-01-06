import axios from "axios";

const api = axios.create({
  baseURL: "/api/trade",
});

export async function getBidCount(): Promise<number> {
  const { data } = await api.get<number>("/countbid");
  return data;
}

export async function getSMP(): Promise<number> {
  const { data } = await api.get<number>("/smp");
  return data;
}

export async function getTotalSupply(): Promise<number> {
  const { data } = await api.get<number>("/supply");
  return data;
}

export async function getRegionalSupply(region: string): Promise<number> {
  const { data } = await api.get<number>(`/supply/${region}`);
  return data;
}

export async function submitBid(region: string, price: number): Promise<void> {
  await api.post("/bid", { region, price });
}
