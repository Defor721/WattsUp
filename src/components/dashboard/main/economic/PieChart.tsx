import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { formatNumberWithDecimal } from "@/hooks/useNumberFormatter";
interface PieChartProps {
  data: {
    수출액: number;
    수입액: number;
    경상수지: number;
  };
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const chartData = [
    { name: "수출액", value: data.수출액 },
    { name: "수입액", value: data.수입액 },
    { name: "경상수지", value: data.경상수지 },
  ];

  const COLORS = ["#3B82F6", "#F59E0B", "#EF4444"];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsPieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label={({ name }) => `${name}`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => formatNumberWithDecimal(value)}
        />
        {/* <Legend /> */}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
