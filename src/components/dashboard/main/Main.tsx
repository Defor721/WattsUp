"use client";

import React, { useState, useEffect } from "react";

import { usePrediction } from "@/hooks/usePrediction";
import Loading from "@/app/loading";
import KakaoMap from "@/components/introduce/KakaoMap";
import { formatNumberWithDecimal } from "@/hooks/useNumberFormatter";
import { Card } from "@/components/shadcn";

import RegionButtons from "./RegionButtons";
import PredictChart from "./Chart";
import PredictTable from "./Table";

export default function DashboardMain() {
  const { weatherData = {}, chartData = {}, loading, error } = usePrediction();

  // 지역 버튼을 위한 데이터 처리
  const availableRegions = Object.keys(weatherData);
  const [selectedRegion, setSelectedRegion] = useState(
    availableRegions.length > 0 ? availableRegions[0] : "서울시",
  );

  // `selectedRegion`이 유효한지 체크하고 자동 수정
  useEffect(() => {
    if (
      !availableRegions.includes(selectedRegion) &&
      availableRegions.length > 0
    ) {
      setSelectedRegion(availableRegions[0]);
    }
  }, [availableRegions, selectedRegion]);

  // `tableData`를 안전하게 변환
  const tableData = (weatherData[selectedRegion] ?? []).map((item, index) => ({
    date: item.date,
    windSpeed: item.windSpeed,
    temperature: item.temperature,
    precipitation: item.precipitation,
    amgo:
      formatNumberWithDecimal(chartData[selectedRegion]?.[index]?.amgo) || "-",
  }));

  if (loading) return <Loading />;
  if (error)
    return (
      <div>
        {typeof error === "string"
          ? error
          : "데이터를 불러오는 중 오류가 발생했습니다."}
      </div>
    );

  return (
    <>
      <RegionButtons
        regions={availableRegions}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />
      <div className="flex flex-col gap-4">
        <div className="grid h-full w-full items-center gap-4 md:grid-cols-1 xl:grid-cols-2">
          <Card className="flex h-[418px] flex-col items-center justify-center gap-2 border-none bg-cardBackground-light p-cardPadding dark:bg-cardBackground-dark md:w-full xl:w-full">
            <h4 className="scroll-m-20 text-center text-xl font-semibold tracking-tight text-[#070f26] dark:text-white">
              태양광 발전소 지도
            </h4>
            <div
              id="map"
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <KakaoMap
                onRegionClick={(region) => setSelectedRegion(region)} // 클릭된 지역 설정
              />
            </div>
          </Card>

          <PredictChart
            data={chartData[selectedRegion] || []} // 데이터가 없으면 빈 배열 전달
            region={selectedRegion}
            selectedRegion={selectedRegion}
          />
        </div>
        <PredictTable
          tableData={tableData ?? []} // undefined가 아닌 빈 배열로 전달
          selectedRegion={selectedRegion}
        />
      </div>
    </>
  );
}
