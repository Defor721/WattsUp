import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

interface LineChartProps {
  data: { name: string; value: number }[]; // 데이터 배열
  xKey: string; // X축 데이터 키
  yKey: string; // Y축 데이터 키
  lineColor: string; // 라인 색상
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  xKey,
  yKey,
  lineColor,
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis tickFormatter={formatNumberWithoutDecimal} />
        <Tooltip
          formatter={(value: number) => formatNumberWithoutDecimal(value)}
        />
        <Legend />
        <Line type="monotone" dataKey={yKey} stroke={lineColor} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
