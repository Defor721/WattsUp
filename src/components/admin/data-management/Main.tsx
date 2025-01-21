"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import Loading from "@/app/loading";
import { usePrediction } from "@/hooks/usePrediction";

import RegionData from "./RegionData";
import TradeTable from "./TradeTable";
import TotalStats from "./TotalStats";
import { fetchBidLists } from "@/services/adminService";

function Main() {
  // 거래 데이터 가져오기
  const {
    data: stats,
    isLoading: isStatsLoading,
    error: tradeError,
  } = useQuery({
    queryKey: ["tradeData"],
    queryFn: async () => {
      const response = await fetchBidLists();
      return response.stats;
    },
    staleTime: 1000 * 60 * 5, // 5분 동안 캐싱
  });

  // 거래 내역 가져오기
  const {
    data: bidLists,
    isLoading: isBidListsLoading,
    error: bidListsError,
  } = useQuery({
    queryKey: ["bidLists"],
    queryFn: async () => {
      const response = await fetchBidLists();
      return response.bids;
    },
  });

  // 예측 데이터 가져오기
  const {
    chartData,
    loading: isChartLoading,
    error: predictionError,
  } = usePrediction();

  // regionData 계산 (chartData가 변경될 때만 실행)
  const regionData = useMemo(() => {
    if (!chartData || Object.keys(chartData).length === 0) return null;

    const today = new Date().toISOString().split("T")[0];

    // 랜덤 값 처리 (지역별 적용)
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

    if (!date) return null;

    return {
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
  }, [chartData]); // chartData가 변경될 때만 계산

  // 로딩 상태 처리
  if (isStatsLoading || isChartLoading || isBidListsLoading) return <Loading />;

  // 에러 상태 처리
  if (tradeError || predictionError || bidListsError) {
    return (
      <p className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</p>
    );
  }

  // if (!chartData || !regionData) return <Loading />;

  return (
    <div className="mt-3 flex flex-col gap-cardGap">
      <TotalStats stats={stats!} />

      {/* regionData를 RegionData로 전달 */}
      <RegionData regionData={regionData!} />

      <TradeTable bidLists={bidLists} />
    </div>
  );
}

export default Main;
