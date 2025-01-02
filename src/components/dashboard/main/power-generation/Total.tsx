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

interface TotalProps {
  data: {
    연도: number;
    총발전량: number;
  }[];
}

function Total({ data }: TotalProps) {
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
          formatter={(value: number) =>
            `${formatNumberWithoutDecimal(value)} MWh`
          }
        />
        <Legend />
        <Bar dataKey="총발전량" fill="#4ADE80" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export default Total;
