"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { formatNumberWithDecimal } from "@/hooks/useNumberFormatter";
import Loading from "@/app/loading";

// 데이터 타입 정의
interface Data {
  date: string;
  amgo: number;
}

interface TodayValueProps {
  selectedRegion: string; // 선택된 지역 이름
  data: Data[]; // 데이터 배열
}

// 파이 차트 컴포넌트
const PieChartComponent = ({ value, max }: { value: number; max: number }) => {
  // 데이터 계산 및 유효성 검사
  const numericValue = Number(value.toString().replace(/,/g, "")); // 콤마 제거

  // 값을 0-100 사이의 퍼센트로 변환
  const percentage = (numericValue / max) * 100;
  const normalizedValue = Math.min(Math.max(0, percentage), 100);

  const data = [
    { name: "현재 값", value: normalizedValue },
    { name: "남은 값", value: 100 - normalizedValue },
  ];

  // 차트 색상 설정
  const COLORS = ["#3b82f6", "#e5e7eb"];

  return (
    <div className="h-[150px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={50}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                strokeWidth={0}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `${Math.round(value)}%`}
            contentStyle={{ background: "#1f2937", border: "none" }}
            itemStyle={{ color: "#fff" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// 정보 카드 컴포넌트
const InfoCard = ({
  title,
  unit,
  value,
  max,
}: {
  title: string;
  unit: string;
  value: string | number;
  max: number;
}) => {
  const router = useRouter();

  return (
    <Card
      className="group relative flex h-[300px] w-1/3 flex-1 cursor-pointer flex-col items-center justify-between overflow-hidden bg-white shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl dark:bg-gray-800"
      onClick={() => router.push("/energy-trade")}
    >
      <CardHeader className="w-full text-center">
        <div className="text-lg font-semibold">{title}</div>
        <div className="text-sm text-gray-500">{unit}</div>
      </CardHeader>
      <CardContent className="flex w-full flex-col items-center justify-center gap-4">
        <div className="text-2xl font-bold">{value}</div>
        <PieChartComponent value={Number(value)} max={max} />
      </CardContent>
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:bg-opacity-30 group-hover:opacity-100">
        <span className="font-medium text-white">거래하러 가기</span>
        <ArrowRight
          className="scale-0 transform text-white transition-all duration-300 group-hover:scale-100"
          size={32}
        />
      </div>
    </Card>
  );
};

function TodayValue({ selectedRegion, data }: TodayValueProps) {
  const [apiData, setApiData] = useState<{
    smpAverage: string;
    recValue: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // AMGO 데이터 설정 (에러 처리 추가)
  const amgo =
    data && data.length > 0 ? formatNumberWithDecimal(data[0].amgo) : "0";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/crawl");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setApiData(result);
      } catch (err) {
        setError("데이터를 불러오는데 실패했습니다. 나중에 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div>
        <Loading />
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="flex w-full flex-col items-center justify-center">
        <h1 className="mb-12 text-3xl font-bold">오늘의 발전정보</h1>
      </div>
      <div className="flex w-full flex-col gap-6 md:flex-row">
        <InfoCard
          title="오늘의 SMP"
          unit="(단위: 원/kWh)"
          value={apiData?.smpAverage || "0"}
          max={100}
        />
        <InfoCard
          title="오늘의 REC"
          unit="(단위: REC, 원/REC)"
          value={apiData?.recValue || "0"}
          max={100000}
        />
        <InfoCard
          title={`오늘의 ${selectedRegion || "전체"} 태양광 발전량 예측값`}
          unit="(단위: kWh)"
          value={amgo}
          max={10000}
        />
      </div>
    </div>
  );
}

export default TodayValue;
