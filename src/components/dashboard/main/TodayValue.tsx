"use client";

import React, { useEffect, useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/shadcn";
import { formatNumberWithDecimal } from "@/hooks/useNumberFormatter";

interface Data {
  date: string;
  amgo: number;
}

interface TodayValueProps {
  selectedRegion: string;
  data: Data[];
}

function TodayValue({ selectedRegion, data }: TodayValueProps) {
  const [smpData, setSmpData] = useState();
  const [recData, setRecData] = useState();
  const [amgo, setAmgo] = useState("");

  useEffect(() => {
    if (data) {
      const formatData = formatNumberWithDecimal(data[0].amgo);
      setAmgo(formatData);
    }
  }, [data, selectedRegion]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/crawl");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        // console.log("크롤링 데이터:", result);
        setSmpData(result.smpAverage);
        setRecData(result.recValue);
      } catch (error: any) {
        console.error("API 호출 실패:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-6">
        <Card className="min-w-[200px]">
          <CardHeader>
            <div className="text-lg font-semibold">오늘의 SMP</div>
            <div className="text-sm text-gray-500">(단위: 원/kWh)</div>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{smpData}</div>
          </CardContent>
        </Card>
        <Card className="min-w-[200px]">
          <CardHeader>
            <div className="text-lg font-semibold">오늘의 REC</div>
            <div className="text-sm text-gray-500">(단위: REC, 원/REC)</div>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{recData}</div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="min-w-[200px]">
          <CardHeader>
            <div className="text-lg font-semibold">
              오늘의 {selectedRegion} 태양광 발전량 예측값
            </div>
            <div className="text-sm text-gray-500">(단위: kWh)</div>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{amgo}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TodayValue;
