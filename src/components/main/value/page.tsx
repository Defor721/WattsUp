"use client";

import React, { useState, useEffect } from "react";

import apiClient from "@/lib/axios";

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
  const [apiData, setApiData] = useState<ApiData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // 컴포넌트가 언마운트 되었는지 확인

    const fetchData = async () => {
      try {
        const { data } = await apiClient.get("/api/crawl");
        if (isMounted) {
          setApiData(data);
        }
      } catch (error) {
        if (isMounted) {
          setError(
            "데이터를 불러오는데 실패했습니다. 나중에 다시 시도해주세요.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // 컴포넌트 언마운트 시 상태 업데이트 방지
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  if (!apiData) {
    return null; // 데이터가 없을 경우 안전하게 반환
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-8 mt-3 text-center text-3xl font-bold xl:mt-0">
        오늘의 전력정보
      </h1>
      <div className="grid gap-cardGap 2xl:grid-cols-3">
        <SMP apiData={apiData} />

        <REC apiData={apiData} />

        <RegionValue />
      </div>
    </div>
  );
}

export default TodayValue;
