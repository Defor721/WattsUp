"use client";

import React, { useState } from "react";

import { usePrediction } from "@/hooks/usePrediction";
import Loading from "@/app/loading";
import KakaoMap from "@/components/introduce/KakaoMap";
import { formatNumberWithDecimal } from "@/hooks/useNumberFormatter";
import { Card } from "@/components/shadcn";

import RegionButtons from "./RegionButtons";
import PredictChart from "./Chart";
import PredictTable from "./Table";

export default function DashboardMain() {
  const { weatherData, chartData, loading, error } = usePrediction();
  const [selectedRegion, setSelectedRegion] = useState("서울시");

  const tableData = weatherData[selectedRegion]?.map((item, index) => ({
    date: item.date,
    windSpeed: item.windSpeed,
    temperature: item.temperature,
    precipitation: item.precipitation,
    amgo:
      formatNumberWithDecimal(chartData[selectedRegion]?.[index]?.amgo) || "-",
  }));

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;

  return (
    <>
      <RegionButtons
        regions={Object.keys(weatherData)}
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
            data={chartData[selectedRegion]} // 여기서 데이터가 제대로 전달되는지 확인 필요
            region={selectedRegion}
            selectedRegion={selectedRegion}
          />
        </div>
        <PredictTable
          tableData={tableData || []}
          selectedRegion={selectedRegion}
        />
      </div>
    </>
  );
}
