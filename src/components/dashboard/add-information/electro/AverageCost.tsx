"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import { Card } from "@/components/shadcn";

interface AverageCostProps {
  value: number;
  maxValue?: number;
}

const AverageCost: React.FC<AverageCostProps> = ({ value, maxValue = 200 }) => {
  const percentage = ((value / maxValue) * 100).toFixed(1); // 비율 계산

  const data = [
    { name: "현재 단가", value },
    { name: "남은 비율", value: maxValue - value },
  ];

  const COLORS = ["#2DD4BF", "#1E293B"]; // 민트와 어두운 배경

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="mb-4 text-4xl font-bold text-teal-300">
        {value.toLocaleString()} 원/kWh
      </p>
      <p className="mb-4 text-sm text-gray-400">
        최고 단가 대비{" "}
        <span className="font-semibold text-teal-300">{percentage}%</span>
      </p>
      <div className="relative h-44 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              startAngle={90}
              endAngle={450}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* 중앙 텍스트 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-semibold">{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default AverageCost;
