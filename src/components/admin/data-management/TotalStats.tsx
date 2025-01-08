import React, { useEffect, useState } from "react";

import { Card } from "@/components/shadcn";
import apiClient from "@/lib/axios";
import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";
import Loading from "@/app/loading";

interface Stats {
  totalPrice: number;
  totalQuantity: number;
  totalCount: number;
}

function TotalStats() {
  const [statsData, setStatsData] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchTradeData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get("/api/admin/userinfo/bidlist");

        const statsData = response.data.stats;
        console.log("statsData: ", statsData);
        setStatsData(statsData);
      } catch (error) {
        console.error("Error fetching trade data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTradeData();
  }, []);

  if (!statsData || isLoading) return <Loading />;

  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="h-10 text-lg font-semibold">전체 데이터</div>
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="text-sm font-semibold">총 거래된 금액</div>
          <div className="text-2xl font-bold">
            {formatNumberWithoutDecimal(statsData.totalPrice)} 원
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-semibold">총 수익</div>
          <div className="text-2xl font-bold">
            {formatNumberWithoutDecimal(statsData.totalPrice * 0.02)} 원
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-semibold">총 거래된 전력량</div>
          <div className="text-2xl font-bold">
            {formatNumberWithoutDecimal(statsData.totalQuantity)} kWh
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-semibold">총 거래 횟수</div>
          <div className="text-2xl font-bold">
            {formatNumberWithoutDecimal(statsData.totalCount)} 회
          </div>
        </Card>
      </div>
    </Card>
  );
}

export default TotalStats;
