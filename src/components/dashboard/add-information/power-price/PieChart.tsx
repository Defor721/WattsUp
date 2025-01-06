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
  data: Array<{ name: string; value: number }>;
  colors: string[];
}

const PieChart: React.FC<PieChartProps> = ({ data, colors }) => {
  const chartColors = colors;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsPieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label={({ name }) => `${name}`}
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={chartColors[index % chartColors.length]}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => `${formatNumberWithDecimal(value)} 원`}
        />
        {/* <Legend /> */}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
