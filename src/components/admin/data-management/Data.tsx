"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { usePrediction } from "@/hooks/usePrediction";
import { Button, Card } from "@/components/shadcn";
import Loading from "@/app/loading";
import { formatNumberWithDecimal } from "@/hooks/useNumberFormatter";

// 지역별 색상 매핑
const regionColors: Record<string, string> = {
  강원도: "#FF5733",
  경기도: "#33FF57",
  경상남도: "#3357FF",
  경상북도: "#FF33A6",
  광주시: "#FFC300",
  대구시: "#DAF7A6",
  대전시: "#900C3F",
  부산시: "#581845",
  서울시: "#C70039",
  세종시: "#FFC0CB",
  울산시: "#008080",
  인천시: "#FF4500",
  전라남도: "#4682B4",
  전라북도: "#6A5ACD",
  충청남도: "#7FFF00",
  충청북도: "#DC143C",
};

function Data() {
  const { chartData, loading, error } = usePrediction();
  const [firstData, setFirstData] = useState<{
    date: string;
    regions: { region: string; amgo: number | string }[];
  } | null>(null); // 지역별 데이터 상태 타입 추가
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // 버튼 비활성화 상태

  // chartData가 변할 때마다 firstData를 계산하여 상태에 저장
  useEffect(() => {
    if (!chartData || Object.keys(chartData).length === 0) {
      console.error("chartData is empty or invalid.");
      return;
    }

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

  // 버튼 상태 복원
  useEffect(() => {
    const savedDate = localStorage.getItem("lastClickedDate");
    const today = new Date().toISOString().split("T")[0];

    if (savedDate === today) {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, []);

  // 백엔드로 firstData 보내기
  const sendRegionsDataToDB = async () => {
    if (!firstData) {
      console.error("No firstData available");
      return;
    }

    try {
      const response = await axios.post(
        "/api/admin/userinfo/updatesupply",
        firstData,
      ); // API 엔드포인트 수정 필요
      console.log("First data sent successfully:", response.data);

      // 버튼 비활성화 및 클릭 날짜 저장
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("lastClickedDate", today);
      setIsButtonDisabled(true);
    } catch (error) {
      console.error("Error sending first data:", error);
    }
  };

  if (!firstData || loading) return <Loading />;

  return (
    <div className="mt-3">
      <div className="mb-3 flex items-center">
        <h4 className="my-3 scroll-m-20 text-xl font-semibold tracking-tight text-[#070f26] dark:text-white">
          데이터 관리 테이블
        </h4>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-5">
          <Button
            onClick={sendRegionsDataToDB}
            disabled={isButtonDisabled} // 버튼 비활성화 상태 반영
            className={`bg-mainColor text-white dark:bg-white dark:text-mainColor ${
              isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            오늘의 지역별 발전량
          </Button>
        </div>

        <div className="flex gap-5">
          {/* 지역별 발전량 텍스트로 표시 */}
          {firstData && (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {firstData.regions
                .sort((a, b) => a.region.localeCompare(b.region))
                .map((regionData) => (
                  <Card key={regionData.region} className="p-5">
                    <p className="text-sm font-semibold">{regionData.region}</p>
                    <p className="text-2xl font-bold">
                      {regionData.amgo.toLocaleString()} MWh
                    </p>
                  </Card>
                ))}
            </div>
          )}

          {/* 파이차트 */}

          <div className="flex-1">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={firstData.regions}
                  dataKey="amgo"
                  nameKey="region"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={(entry) => `${entry.region}`}
                  stroke="none"
                >
                  {firstData.regions
                    .sort((a, b) => Number(b.amgo) - Number(a.amgo))
                    .map((regionData) => (
                      <Cell
                        key={`cell-${regionData.region}`}
                        fill={regionColors[regionData.region] || "#8884d8"} // 지역 색상 적용
                      />
                    ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    `${formatNumberWithDecimal(value)} MWh`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Data;
