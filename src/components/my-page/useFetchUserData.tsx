import { useState, useEffect } from "react";

import apiClient from "@/lib/axios";

interface UserTradeData {
  message: string;
  stats: {
    totalPrice: number;
    totalQuantity: number;
    documentCount: number;
  };
  bidData: {
    email: string;
    now: string;
    price: number;
    quantity: number;
    region: string;
  }[];
}

const useFetchUserTradeData = () => {
  const [data, setData] = useState<UserTradeData | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get<UserTradeData>(
          "http://localhost:3000/api/users/traderecord",
        );
        setData(response.data);
      } catch (error) {
        setError(true);
        console.error("error: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { data, error, loading };
};

export default useFetchUserTradeData;
