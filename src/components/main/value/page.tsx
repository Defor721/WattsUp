"use client";

import React, { useState, useEffect } from "react";

import apiClient from "@/lib/axios";

import RegionValue from "./RegionValue";
import SMP from "./SMP";
import REC from "./REC";
import { useQuery } from "@tanstack/react-query";
import { fetchCrawlData, fetchSupplyData } from "@/services/tradeService";

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
  // SMP
  const { data: SMPData, isLoading: isSMPLoading } = useQuery({
    queryKey: ["SMPData"],
    queryFn: () => fetchCrawlData().then((res) => res.todaySmpData),
  });
  // REC
  const { data: RECData, isLoading: isRECLoading } = useQuery({
    queryKey: ["RECData"],
    queryFn: () => fetchCrawlData().then((res) => res.todayRecData),
  });

  // 지역별 발전량
  const { data: regionData, isLoading: isRegionValueLoading } = useQuery({
    queryKey: ["regionValue"],
    queryFn: fetchSupplyData,
  });

  if (isSMPLoading || isRECLoading || isRegionValueLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <div className="text-lg text-red-500">{error}</div>
  //     </div>
  //   );
  // }

  if (!SMP || !REC || !regionData) {
    return null; // 데이터가 없을 경우 안전하게 반환
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-8 mt-3 text-center text-3xl font-bold xl:mt-0">
        오늘의 전력정보
      </h1>
      <div className="grid gap-cardGap 2xl:grid-cols-3">
        <SMP smpData={SMPData} />

        <REC recData={RECData} />

        <RegionValue regionData={regionData} />
      </div>
    </div>
  );
}

export default TodayValue;
