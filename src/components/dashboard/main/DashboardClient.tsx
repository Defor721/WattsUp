"use client";

import React, { useState, useMemo } from "react";

import { formatNumberWithDecimal } from "@/hooks/useNumberFormatter";
import KakaoMap from "@/components/introduce/KakaoMap";
import Loading from "@/app/loading";

import Container from "./Container";
import RegionButtons from "./RegionButtons";
import PredictChart from "./Chart";
import PredictTable from "./Table";

interface Props {
  weatherData: Record<string, any[]>;
  predictions: Record<string, any[]>;
}

function DashboardClient({ weatherData, predictions }: Props) {
  const [selectedRegion, setSelectedRegion] = useState("서울시");

  const tableData = useMemo(() => {
    if (!weatherData || !selectedRegion) return [];
    return weatherData[selectedRegion].map((item, index) => ({
      date: item.date,
      windSpeed: item.windSpeed,
      temperature: item.temperature,
      precipitation: item.precipitation,
      amgo: predictions[selectedRegion]?.[index]?.amgo
        ? formatNumberWithDecimal(predictions[selectedRegion][index].amgo)
        : "-",
    }));
  }, [selectedRegion, weatherData, predictions]);

  if (!weatherData || !predictions) return <Loading />;

  return (
    <Container>
      <div className="mb-10 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-mainColor dark:text-white">
            대시보드
          </h2>
          <div className="flex justify-end">
            <RegionButtons
              regions={Object.keys(weatherData)}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
            />
          </div>
        </div>
      </div>
      <div className="mb-10 flex h-full w-full gap-6">
        <div
          id="map"
          style={{
            width: "35%",
            height: "300px",
          }}
        >
          <KakaoMap onRegionClick={(region) => setSelectedRegion(region)} />
        </div>
        <PredictChart
          data={predictions[selectedRegion]}
          region={selectedRegion}
          selectedRegion={selectedRegion}
        />
      </div>
      <PredictTable tableData={tableData} selectedRegion={selectedRegion} />
    </Container>
  );
}

export default DashboardClient;
