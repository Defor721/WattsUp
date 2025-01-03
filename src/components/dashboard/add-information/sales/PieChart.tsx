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
    labels: string[];
    datasets: { data: number[]; backgroundColor: string[] }[];
  } | null;
  colors?: string[];
}

const PieChart: React.FC<PieChartProps> = ({ data, colors }) => {
  // 데이터가 null일 경우 처리
  if (!data || !data.datasets || !data.labels) {
    return <div>데이터가 없습니다.</div>;
  }

  // 차트 데이터 변환
  const chartData = data.labels.map((label, index) => ({
    name: label,
    value: data.datasets[0].data[index],
    color: data.datasets[0].backgroundColor[index],
  }));

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
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => `${formatNumberWithDecimal(value)} 원`}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
