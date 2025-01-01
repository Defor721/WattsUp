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
    수력: number;
    화력: number;
    원자력: number;
    자가용: number;
  };
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const chartData = [
    { name: "수력", value: data.수력, color: "#3B82F6" },
    { name: "화력", value: data.화력, color: "#F59E0B" },
    { name: "원자력", value: data.원자력, color: "#EF4444" },
    { name: "자가용", value: data.자가용, color: "#22C55E" },
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsPieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={120}
          fill="#8884d8"
          label={({ name }) => `${name}`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => `${formatNumberWithDecimal(value)} GWh`}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
