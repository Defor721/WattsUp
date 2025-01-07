"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { usePrediction } from "@/hooks/usePrediction";
import { Button, Card } from "@/components/shadcn";
import Loading from "@/app/loading";

function Data() {
  const { chartData, loading, error } = usePrediction();
  const [firstData, setFirstData] = useState<{
    date: string;
    regions: { region: string; amgo: number }[];
  } | null>(null); // 지역별 데이터 상태 타입 추가

  // chartData가 변할 때마다 firstData를 계산하여 상태에 저장
  useEffect(() => {
    if (!chartData) return;

    // 첫 번째 지역 데이터의 날짜 추출
    const firstRegion = Object.values(chartData)[0];
    const date = firstRegion ? firstRegion[0].date : null;

    if (!date) {
      console.error("Date not found in chartData");
      return;
    }

    // 지역별 발전량 데이터 가공
    const processedFirstData = {
      date,
      regions: Object.entries(chartData).map(([region, data]) => ({
        region,
        amgo: data[0]?.amgo || 0, // 첫 번째 데이터의 amgo 값 추출
      })),
    };

    setFirstData(processedFirstData);
  }, [chartData]);

  // 백엔드로 firstData 보내기
  const sendRegionsDataToDB = async () => {
    if (!firstData) {
      console.error("No firstData available");
      return;
    }
    console.log(firstData);
    try {
      const response = await axios.post(
        "/api/admin/userinfo/updatesupply",
        firstData,
      ); // API 엔드포인트 수정 필요
      console.log("First data sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending first data:", error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="mt-3">
      <div className="mb-3 flex items-center">
        <h4 className="my-3 scroll-m-20 text-xl font-semibold tracking-tight text-[#070f26] dark:text-white">
          데이터 관리 테이블
        </h4>
      </div>
      <div className="mx-auto flex w-full gap-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Button
              onClick={sendRegionsDataToDB}
              className="bg-mainColor text-white dark:bg-white dark:text-mainColor"
            >
              오늘의 지역별 발전량
            </Button>
          </div>

          {/* 지역별 발전량 텍스트로 표시 */}
          {firstData && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {firstData.regions.map((regionData) => (
                <Card key={regionData.region} className="p-5">
                  <p className="text-sm font-semibold">{regionData.region}</p>
                  <p className="text-2xl font-bold">
                    {regionData.amgo.toLocaleString()} MWh
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Data;
