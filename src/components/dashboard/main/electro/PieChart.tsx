import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
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
  colors: string[]; // 색상을 상위에서 전달받도록 추가
}

const PieChart: React.FC<PieChartProps> = ({ data, colors }) => {
  const chartData = [
    { name: "수력", value: data.수력 },
    { name: "화력", value: data.화력 },
    { name: "원자력", value: data.원자력 },
    { name: "자가용", value: data.자가용 },
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
          label={({ name }) => `${name}`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => `${formatNumberWithDecimal(value)} GWh`}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
