import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import { Card } from "@/components/shadcn";
import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

// 지역 데이터 타입 정의
interface Region {
  name: string;
  value: number;
}

// 각 지역의 색상 정의
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

function RegionValue1() {
  const [regionIndex, setRegionIndex] = useState(0);
  const [regions, setRegions] = useState<Region[]>([]);
  const [total, setTotal] = useState<number>(0); // 총 공급량

  useEffect(() => {
    // 지역 데이터 정리
    const fetchTotalData = async () => {
      const response = await fetch("/api/trade/supply");
      const totalData = await response.json();

      const formattedRegions = Object.entries(totalData.result).map(
        ([name, value]) => ({
          name,
          value: Number(value),
        }),
      );

      setRegions(formattedRegions);
      setTotal(Number(totalData.total)); // 총 공급량 저장
    };

    fetchTotalData();
  }, []);

  useEffect(() => {
    if (regions.length > 0) {
      // 3초마다 지역 변경
      const interval = setInterval(() => {
        setRegionIndex((prevIndex) => (prevIndex + 1) % regions.length);
      }, 3000);

      return () => clearInterval(interval); // 클린업 함수
    }
  }, [regions]);

  if (regions.length === 0 || total === 0) {
    return <div>로딩 중...</div>;
  }

  // 누적 각도를 계산
  let accumulatedAngle = 0;

  // 차트 데이터 생성
  const chartData = regions.map((region) => {
    const percentage = (region.value / total) * 100;
    const startAngle = accumulatedAngle;
    const endAngle = accumulatedAngle + (percentage * 360) / 100;
    accumulatedAngle = endAngle; // 누적 각도 업데이트
    return { ...region, startAngle, endAngle };
  });

  // 현재 지역 데이터
  const currentRegion = chartData[regionIndex];

  return (
    <Card className="w-[488px] border-none bg-cardBackground-light p-cardPadding dark:bg-cardBackground-dark">
      <div className="py-3 text-center text-lg font-semibold">
        오늘의 {currentRegion.name} 전력 공급량
      </div>
      <div className="relative flex items-center justify-center">
        {/* <ResponsiveContainer width={200} height={200}> */}
        <PieChart width={200} height={200}>
          <Pie
            data={[{ name: currentRegion.name, value: currentRegion.value }]}
            dataKey="value"
            innerRadius={70}
            outerRadius={100}
            startAngle={currentRegion.startAngle}
            endAngle={currentRegion.endAngle}
            stroke="none"
            isAnimationActive // 애니메이션 활성화
            animationDuration={1000} // 애니메이션 지속 시간
          >
            <Cell
              key={`cell-${regionIndex}`}
              fill={regionColors[currentRegion.name] || "#CCCCCC"} // 색상 적용
            />
          </Pie>
        </PieChart>
        {/* </ResponsiveContainer> */}
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

export default RegionValue1;
