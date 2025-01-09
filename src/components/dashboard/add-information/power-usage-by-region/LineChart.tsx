import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  formatNumberWithDecimal,
  formatNumberWithoutDecimal,
} from "@/hooks/useNumberFormatter";

interface LineChartProps {
  data: { year: number; total: number }[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400} className="mx-auto">
      <RechartsLineChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
      >
        <XAxis dataKey="year" />
        <YAxis tickFormatter={formatNumberWithoutDecimal} />
        <Tooltip
          formatter={(value: number) =>
            `${formatNumberWithoutDecimal(value)} 명`
          }
          labelStyle={{
            color: "#000000", // 레이블(년도)을 항상 검은색으로 설정
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="total" stroke="#34D399" name="총합" />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
