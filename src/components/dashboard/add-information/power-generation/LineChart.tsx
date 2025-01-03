import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

interface LineChartProps {
  data: {
    연도: number;
    수력: number;
    원자력: number;
    신재생: number;
    가스: number;
    유연탄: number;
  }[];
  colors: { [key: string]: string };
}

function LineChart({ data, colors }: LineChartProps) {
  const keys = ["수력", "원자력", "신재생", "가스", "유연탄"];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 20, left: 45, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="연도" />
        <YAxis tickFormatter={formatNumberWithoutDecimal} />
        <Tooltip
          formatter={(value: number) =>
            `${formatNumberWithoutDecimal(value)} MWh`
          }
        />
        <Legend />
        {keys.map((key) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[key]}
            strokeWidth={2}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export default LineChart;
