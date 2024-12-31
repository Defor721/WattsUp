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
  data: { 연도: number; 값: number }[]; // Recharts에서 사용할 데이터 형식
  xKey: string; // x축 키 (ex: 연도)
  yKey: string; // y축 키 (ex: 값)
}

const LineChart: React.FC<LineChartProps> = ({ data, xKey, yKey }) => {
  return (
    <ResponsiveContainer width="100%" height={400} className="mx-auto">
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis tickFormatter={formatNumberWithoutDecimal} />
        <Tooltip
          formatter={(value: number) => formatNumberWithDecimal(value)}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey={yKey}
          stroke="#60A5FA"
          fill="#60A5FA"
          name="국내 총 생산"
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
