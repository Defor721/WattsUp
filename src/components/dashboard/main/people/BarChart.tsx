import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BarChartProps {
  data: { 연도: number; 값: number }[]; // Recharts에서 사용할 데이터 형식
  xKey: string; // x축 키 (ex: 연도)
  yKey: string; // y축 키 (ex: 값)
}

const BarChart: React.FC<BarChartProps> = ({ data, xKey, yKey }) => {
  return (
    <ResponsiveContainer width="100%" height={400} className="mx-auto">
      <RechartsBarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip formatter={(value: number) => `${value}%`} />
        <Legend />
        <Bar dataKey={yKey} fill="#4ADE80" name="경제 성장률" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
