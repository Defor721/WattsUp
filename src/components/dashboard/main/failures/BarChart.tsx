import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

interface BarChartProps {
  data: Array<{ [key: string]: any }>;
  keys: string[]; // Bar keys (e.g., ["발전설비", "송전설비"])
}

const BarChart: React.FC<BarChartProps> = ({ data, keys }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsBarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="연도" />
        <YAxis tickFormatter={formatNumberWithoutDecimal} />
        <Tooltip
          formatter={(value: number) => formatNumberWithoutDecimal(value)}
        />
        <Legend />
        {keys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={["#34D399", "#60A5FA", "#FBBF24", "#EF4444"][index]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
