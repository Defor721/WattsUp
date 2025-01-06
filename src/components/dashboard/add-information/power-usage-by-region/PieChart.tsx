import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

interface PieChartProps {
  data: { name: string; value: number }[]; // 데이터 타입
  colors: Record<string, string>; // 색상 타입을 Record로 변경
}

const PieChart: React.FC<PieChartProps> = ({ data, colors }) => {
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
          stroke="none"
        >
          {data.map((entry) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={colors[entry.name]} // 지역 이름 기반 색상 적용
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) =>
            `${formatNumberWithoutDecimal(value)} 명`
          }
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
