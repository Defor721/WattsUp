"use client";

import React, { useState } from "react";

import { usePrediction } from "@/hooks/usePrediction";
import Loading from "@/app/loading";
import KakaoMap from "@/components/introduce/KakaoMap";
import { formatNumberWithDecimal } from "@/hooks/useNumberFormatter";
import { Card } from "@/components/shadcn";

import Container from "./Container";
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
    <Container>
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-mainColor first:mt-0 dark:text-white">
        대시보드
      </h2>
      <RegionButtons
        regions={Object.keys(weatherData)}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />
      <div className="flex flex-col gap-4">
        <div className="flex h-full w-full items-center gap-4">
          <Card className="flex h-[418px] w-[500px] flex-col items-center justify-center p-cardPadding">
            <h4 className="my-2 scroll-m-20 pb-5 text-center text-xl font-semibold tracking-tight text-[#070f26] dark:text-white">
              태양광 발전소 지도
            </h4>
            <div
              id="map"
              style={{
                width: "100%",
                height: "300px",
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
    </Container>
  );
}
