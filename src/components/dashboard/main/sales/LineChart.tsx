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

import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

interface LineChartProps {
  data: { year: number; 합계: number }[]; // Recharts-friendly format
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsLineChart
        data={data} // 직접 데이터를 전달
        margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255, 255, 255, 0.2)"
        />
        <XAxis dataKey="year" />
        <YAxis className="text-sm" tickFormatter={formatNumberWithoutDecimal} />
        <Tooltip
          formatter={(value: number) => `${value.toLocaleString()} 원`}
        />
        <Legend wrapperStyle={{ color: "#fff" }} />
        <Line
          type="monotone"
          dataKey="합계"
          stroke="#34D399"
          fill="rgba(52, 211, 153, 0.2)"
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
