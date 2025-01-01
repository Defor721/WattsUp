import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface LineChartProps {
  data: {
    연도: number;
    총발전량: number;
  }[];
}

function LineChart({ data }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="연도" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="총발전량"
          stroke="#4ADE80"
          strokeWidth={2}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export default LineChart;
