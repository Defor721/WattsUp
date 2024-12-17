"use client";

import React from "react";
import dynamic from "next/dynamic";

import { Card } from "@/components/ui/card";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface AverageCostProps {
  value: number;
  maxValue: number;
}

const AverageCost: React.FC<AverageCostProps> = ({ value, maxValue }) => {
  const percentage = ((value / maxValue) * 100).toFixed(1); // 비율 계산
  return (
    <Card className="mb-6 flex flex-col items-center justify-center rounded-lg bg-gray-800 p-6">
      <h2 className="mb-2 text-lg font-semibold text-white">평균 판매단가</h2>
      <p className="mb-4 text-4xl font-bold text-teal-300">
        {value.toLocaleString()} 원/kWh
      </p>
      <p className="mb-4 text-sm text-gray-400">
        최고 단가 대비{" "}
        <span className="font-semibold text-teal-300">{percentage}%</span>
      </p>

      {/* 차트 부분 배경 강조 */}
      <div
        className="rounded-lg p-4"
        style={{
          backgroundColor: "#1E293B",
          boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
        }}
      >
        <Plot
          data={[
            {
              type: "pie",
              hole: 0.6,
              rotation: 90,
              values: [value, maxValue - value],
              labels: ["현재 단가", "남은 비율"],
              marker: {
                colors: ["#2DD4BF", "#334155"], // 차트 색상: 민트와 어두운 그레이
              },
              textinfo: "none",
              showlegend: false,
            },
          ]}
          layout={{
            width: 300,
            height: 150,
            margin: { t: 0, b: 0, l: 0, r: 0 },
            paper_bgcolor: "transparent", // 차트 투명 배경
            annotations: [
              {
                text: `${percentage}%`,
                x: 0.5,
                y: 0.5,
                showarrow: false,
                font: { size: 20, color: "#FFFFFF" },
              },
            ],
          }}
          config={{ displayModeBar: false }}
        />
      </div>
    </Card>
  );
};

export default AverageCost;
