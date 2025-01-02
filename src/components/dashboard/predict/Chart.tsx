"use client";

import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  formatNumberWithDecimal,
  formatNumberWithoutDecimal,
} from "@/hooks/useNumberFormatter";

interface dataProps {
  amgo: number;
  date: string;
}

interface Ichart {
  data: dataProps[];
  region: string;
  selectedRegion: string;
}

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

function PredictChart({ data, region, selectedRegion }: Ichart) {
  const strokeColor = regionColors[region]; // 지역에 따른 색상 가져오기
  console.log("Chart Data:", data);

  if (!data) return;

  return (
    <div className="mt-5">
      <h4 className="my-2 scroll-m-20 text-center text-xl font-semibold tracking-tight text-[#070f26] dark:text-white">
        {selectedRegion} 태양광 발전량 예측 그래프
      </h4>

      <ResponsiveContainer width={"100%"} aspect={16 / 4}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" className="text-sm" />
          <YAxis tickFormatter={formatNumberWithoutDecimal} />

          <Tooltip
            formatter={(value: number) => formatNumberWithDecimal(value)}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="amgo"
            stroke={strokeColor}
            name="태양광 발전량"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PredictChart;
