"use client";

import React, { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";

import { Card } from "@/components/shadcn";
import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

// 지역 데이터 타입 정의
interface Region {
  name: string;
  value: number;
}

interface RegionValueProps {
  regionData: {
    message: string;
    result: Record<string, number>;
    total: number;
  };
}

// 각 지역의 색상 정의
const regionColors: Record<string, string> = {
  강원도: "#FF5733",
  경기도: "#33FF57",
  경상남도: "#3357FF",
  경상북도: "#FF33A6",
  광주시: "#FFC300",
  대구시: "#FF7F50",
  대전시: "#9370DB",
  부산시: "#2E8B57",
  서울시: "#C70039",
  세종시: "#FF4500",
  울산시: "#008080",
  인천시: "#FF6347",
  전라남도: "#4682B4",
  전라북도: "#6A5ACD",
  충청남도: "#FF1493",
  충청북도: "#DC143C",
};

function RegionValue({ regionData }: RegionValueProps) {
  const [regionIndex, setRegionIndex] = useState(0);

  const total = regionData.total;
  const regions: Region[] = Object.entries(regionData.result).map(
    ([name, value]) => ({
      name,
      value: Number(value),
    }),
  );

  useEffect(() => {
    if (regions.length > 0) {
      // 3초마다 지역 변경
      const interval = setInterval(() => {
        setRegionIndex((prevIndex) => (prevIndex + 1) % regions.length);
      }, 3000);

      return () => clearInterval(interval); // 클린업 함수
    }
  }, [regions]);

  // 차트 데이터 생성
  const chartData = useMemo(() => {
    // 누적 각도를 계산
    let accumulatedAngle = 0;

    return regions.map((region) => {
      const percentage = (region.value / total) * 100;
      const startAngle = accumulatedAngle;
      const endAngle = accumulatedAngle + (percentage * 360) / 100;
      accumulatedAngle = endAngle; // 누적 각도 업데이트
      return { ...region, startAngle, endAngle };
    });
  }, [regions, total]);

  // 현재 지역 데이터
  const currentRegion = chartData[regionIndex];

  return (
    <Card className="min-w-[432px] border-none bg-cardBackground-light p-cardPadding shadow-md dark:bg-cardBackground-dark">
      <div className="py-3 text-center text-lg font-semibold">
        오늘의 {currentRegion.name} 전력 공급량
      </div>
      <div className="relative flex items-center justify-center">
        <PieChart width={200} height={200}>
          {/* 파이 전체 테두리를 위한 Pie */}
          <Pie
            data={[{ value: 1 }]} // 더미 데이터
            dataKey="value"
            innerRadius={70} // 테두리 안쪽 반지름
            outerRadius={99} // 테두리 바깥쪽 반지름
            fill="none" // 내부 투명
            stroke="#ccc" // 테두리 색상
            strokeWidth={1} // 테두리 두께
          />

          {/* 실제 데이터를 위한 Pie */}
          <Pie
            data={[{ name: currentRegion.name, value: currentRegion.value }]}
            dataKey="value"
            innerRadius={70}
            outerRadius={99}
            startAngle={currentRegion.startAngle}
            endAngle={currentRegion.endAngle}
            stroke="none"
            isAnimationActive // 애니메이션 활성화
            animationDuration={1000} // 애니메이션 지속 시간
          >
            <Cell
              key={`cell-${regionIndex}`}
              fill={regionColors[currentRegion.name] || "#CCC"} // 색상 적용
            />
          </Pie>
        </PieChart>
        <div className="absolute text-center">
          <div className="text-2xl font-bold">
            {formatNumberWithoutDecimal(currentRegion.value)} kWh
          </div>
          <div className="text-sm text-gray-500">
            ({((currentRegion.value / total) * 100).toFixed(2)}%)
          </div>
        </div>
      </div>
    </Card>
  );
}

export default RegionValue;
