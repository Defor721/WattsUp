"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

import { usePrediction } from "@/hooks/usePrediction";
import { Button, Card } from "@/components/shadcn";
import Loading from "@/app/loading";

function RegionData() {
  const { chartData, loading } = usePrediction();
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
      </div>
    </div>
  );
}

export default RegionData;
