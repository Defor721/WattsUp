// DoughnutChart.tsx
import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

interface PieChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
  } | null;
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  if (!data) {
    return <p>데이터가 없습니다.</p>;
  }

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
          innerRadius={70}
          outerRadius={100}
          fill="#8884d8"
          label={({ name }) => `${name}`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) =>
            `${formatNumberWithoutDecimal(value)}원`
          }
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
