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

import { formatNumberWithDecimal } from "@/hooks/useNumberFormatter";

interface BarChartProps {
  data: Array<{ name: string; value: number }>;
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsBarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value: number) => `${formatNumberWithDecimal(value)} 원`}
          labelStyle={{
            color: "#000000", // 레이블(년도)을 항상 검은색으로 설정
          }}
        />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" name={"판매 단가 총합"} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
