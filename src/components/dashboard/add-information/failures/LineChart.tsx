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
  data: Array<{ [key: string]: any }>;
  dataKey: string; // Line data key (e.g., "총계")
}

const LineChart: React.FC<LineChartProps> = ({ data, dataKey }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsLineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <XAxis dataKey="연도" />
        <YAxis tickFormatter={formatNumberWithoutDecimal} />
        <Tooltip
          formatter={(value: number) =>
            `${formatNumberWithoutDecimal(value)} 건`
          }
          labelStyle={{
            color: "#000000", // 레이블(년도)을 항상 검은색으로 설정
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke="#4ADE80"
          fillOpacity={0.2}
          fill="rgba(72, 223, 128, 0.2)"
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
