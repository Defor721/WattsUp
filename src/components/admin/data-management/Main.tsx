"use client";

import React, { useEffect, useState } from "react";

import apiClient from "@/lib/axios";
import Loading from "@/app/loading";
import { usePrediction } from "@/hooks/usePrediction";

import RegionData from "./RegionData";
import TradeTable from "./TradeTable";
import TotalStats from "./TotalStats";

export interface Stats {
  totalPrice: number;
  totalQuantity: number;
  totalCount: number;
}

interface IRegionData {
  date: string;
  amgo: number;
}

type ChartData = Record<string, IRegionData[]>;

const fetchTradeData = async () => {
  try {
    const response = await apiClient.get("/api/admin/userinfo/bidlist");

    const statsData = response.data.stats;
    return statsData;
  } catch (error) {
    console.error("Error fetching trade data:", error);
    return null;
  }
};

function Main() {
  const [isLoading, setIsLoading] = useState(true);

  // TotalStats states
  const [stats, setStats] = useState<Stats | null>(null);

  // RegionData states
  const { chartData }: { chartData: ChartData } = usePrediction();

  // firstData 상태
  const [firstData, setFirstData] = useState<{
    date: string;
    regions: { region: string; amgo: number }[];
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      const [statsData] = await Promise.all([fetchTradeData()]);
      setStats(statsData);

      // chartData에서 firstData 생성
      if (chartData && Object.keys(chartData).length > 0) {
        const today = new Date().toISOString().split("T")[0];

        // 랜덤 값 처리
        const storedData = localStorage.getItem("regionRandomFactors");
        let randomFactors: Record<string, number> = {};

        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData.date === today) {
            randomFactors = parsedData.factors;
          }
        }

        if (Object.keys(randomFactors).length === 0) {
          randomFactors = Object.keys(chartData).reduce(
            (acc, region) => {
              acc[region] = Math.random() * (1.2 - 0.8) + 0.8; // 0.8 ~ 1.2
              return acc;
            },
            {} as Record<string, number>,
          );

          localStorage.setItem(
            "regionRandomFactors",
            JSON.stringify({ date: today, factors: randomFactors }),
          );
        }

        const firstRegion = Object.values(chartData)[0];
        const date = firstRegion ? firstRegion[0].date : null;

        if (date) {
          const processedFirstData = {
            date,
            regions: Object.entries(chartData).map(([region, data]) => {
              const randomFactor = randomFactors[region] || 1;
              const adjustedAmgo = (data[0]?.amgo || 0) * randomFactor;

              return {
                region,
                amgo: Math.round(adjustedAmgo),
              };
            }),
          };

          setFirstData(processedFirstData);
        }
      }

      setIsLoading(false);
    };

    loadData();
  }, [chartData]);

  if (isLoading || !chartData || !firstData) return <Loading />;

  return (
    <div className="mt-3 flex flex-col gap-cardGap">
      <TotalStats stats={stats} />

      {/* firstData를 RegionData로 전달 */}
      <RegionData firstData={firstData} />

      <TradeTable />
    </div>
  );
}

export default Main;
