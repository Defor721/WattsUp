import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

interface TotalData {
  name: string;
  value: number;
}

function PieChart({
  totalData,
  colors,
}: {
  totalData: TotalData[];
  colors: string[];
}) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsPieChart>
        <Pie
          data={totalData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label={({ name }) => `${name}`} // 라벨에 이름만 표시
        >
          {totalData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) =>
            `${formatNumberWithoutDecimal(value)} MWh`
          }
        />
        {/* <Legend /> */}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

export default PieChart;
