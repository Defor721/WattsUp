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

import {
  formatNumberWithDecimal,
  formatNumberWithoutDecimal,
} from "@/hooks/useNumberFormatter";

interface BarChartProps {
  data: { category: string; value: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400} className="mx-auto">
      <RechartsBarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis tickFormatter={formatNumberWithoutDecimal} />
        <Tooltip
          formatter={(value: number) => formatNumberWithDecimal(value)}
        />
        <Legend />
        <Bar dataKey="value" fill="#3B82F6" name={"수출액"} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
