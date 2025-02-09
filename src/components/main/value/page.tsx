"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCrawlData, fetchSupplyData } from "@/services/tradeService";

import RegionValue from "./RegionValue";
import SMP from "./SMP";
import REC from "./REC";

export interface ApiData {
  todaySmpData: {
    거래일: string;
    최고가: number;
    최소가: number;
    평균가: number;
  };
  todayRecData: {
    거래량: number;
    거래일: string;
    종가: number;
    최고가: number;
    최저가: number;
    평균가: number;
  };
}

function TodayValue() {
  // SMP 데이터
  const { data: SMPData, isLoading: isSMPLoading } = useQuery({
    queryKey: ["SMPData"],
    queryFn: async () => {
      try {
        const res = await fetchCrawlData();
        return res.todaySmpData;
      } catch (error) {
        console.error("SMP 데이터 가져오기 실패:", error);
        return null;
      }
    },
  });

  // REC 데이터
  const { data: RECData, isLoading: isRECLoading } = useQuery({
    queryKey: ["RECData"],
    queryFn: async () => {
      try {
        const res = await fetchCrawlData();
        return res.todayRecData;
      } catch (error) {
        console.error("REC 데이터 가져오기 실패:", error);
        return null;
      }
    },
  });

  // 지역별 발전량
  const { data: regionData, isLoading: isRegionValueLoading } = useQuery({
    queryKey: ["regionValue"],
    queryFn: fetchSupplyData,
  });

  // 로딩 상태 처리
  if (isSMPLoading || isRECLoading || isRegionValueLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  // 데이터가 없는 경우 기본값 처리
  if (!SMPData || !RECData || !regionData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-500">데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-8 mt-3 text-center text-3xl font-bold xl:mt-0">
        오늘의 전력정보
      </h1>
      <div className="grid gap-cardGap 2xl:grid-cols-3">
        <SMP
          smpData={SMPData ?? { 거래일: "", 최고가: 0, 최소가: 0, 평균가: 0 }}
        />
        <REC
          recData={
            RECData ?? {
              거래량: 0,
              거래일: "",
              종가: 0,
              최고가: 0,
              최저가: 0,
              평균가: 0,
            }
          }
        />
        <RegionValue regionData={regionData} />
      </div>
    </div>
  );
}

export default TodayValue;
