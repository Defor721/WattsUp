import React from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AreaChartProps {
  previousYearData: { name: string; value: number }[];
  currentYearData: { name: string; value: number }[];
}

const AreaChart: React.FC<AreaChartProps> = ({
  previousYearData,
  currentYearData,
}) => {
  const data = previousYearData.map((item, index) => ({
    name: item.name,
    지난연도: item.value,
    현재연도: currentYearData[index]?.value || 0,
  }));
  console.log("data: ", data);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsAreaChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => `${value} GWh`} />
        <Area
          type="monotone"
          dataKey="지난연도"
          stackId="1"
          stroke="#38bdf8"
          fill="rgba(56, 189, 248, 0.2)"
        />
        <Area
          type="monotone"
          dataKey="현재연도"
          stackId="1"
          stroke="#f472b6"
          fill="rgba(244, 114, 182, 0.2)"
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChart;
