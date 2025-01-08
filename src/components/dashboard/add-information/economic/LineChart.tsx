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
    수출액: number;
    수입액: number;
    환율: number;
  }[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="연도" />
        <YAxis tickFormatter={formatNumberWithoutDecimal} />
        <Tooltip
          formatter={(value: number) => formatNumberWithDecimal(value)}
        />
        <Legend />
        <Line type="monotone" dataKey="수출액" stroke="#3B82F6" />
        <Line type="monotone" dataKey="수입액" stroke="#F59E0B" />
        <Line type="monotone" dataKey="환율" stroke="#22C55E" />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
