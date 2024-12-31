import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

interface PieChartProps {
  data: { name: string; value: number }[];
}

const COLORS = [
  "#34D399",
  "#60A5FA",
  "#F87171",
  "#93C5FD",
  "#FBBF24",
  "#A78BFA",
  "#FCA5A5",
  "#2DD4BF",
  "#4ADE80",
  "#FB7185",
  "#C084FC",
  "#FACC15",
  "#F97316",
  "#10B981",
  "#6366F1",
  "#EAB308",
  "#8B5CF6",
];

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label={({ name }) => `${name}`}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => formatNumberWithoutDecimal(value)}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
