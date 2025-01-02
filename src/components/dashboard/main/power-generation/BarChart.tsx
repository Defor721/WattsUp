import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

import { DataRow } from "./PowerGeneration";

function BarChart({ data }: { data: DataRow[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsBarChart
        data={data}
        margin={{ top: 5, right: 20, left: 45, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="연도" />
        <YAxis tickFormatter={formatNumberWithoutDecimal} />
        <Tooltip
          formatter={(value: number) => formatNumberWithoutDecimal(value)}
        />
        <Legend />
        <Bar dataKey="수력소계" fill="#4ADE80" />
        <Bar dataKey="원자력" fill="#60A5FA" />
        <Bar dataKey="신재생" fill="#FBBF24" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export default BarChart;
