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
  colors: string[];
}

const PieChart: React.FC<PieChartProps> = ({ data, colors }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) =>
            `${formatNumberWithoutDecimal(value)} 회`
          }
        />
        {/* <Legend /> */}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
