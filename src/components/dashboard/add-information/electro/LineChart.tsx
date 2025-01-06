import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  formatNumberWithDecimal,
  formatNumberWithoutDecimal,
} from "@/hooks/useNumberFormatter";

interface LineChartProps {
  data: {
    연도: number;
    수력: number;
    화력: number;
    원자력: number;
    자가용: number;
  }[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="연도" />
        <YAxis tickFormatter={formatNumberWithoutDecimal} />
        <Tooltip
          formatter={(value: number) => `${formatNumberWithDecimal(value)} GWh`}
        />
        <Legend />
        <Line type="monotone" dataKey="수력" stroke="#60a5fa" />
        <Line type="monotone" dataKey="화력" stroke="#facc15" />
        <Line type="monotone" dataKey="원자력" stroke="#f87171" />
        <Line type="monotone" dataKey="자가용" stroke="#4ade80" />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
