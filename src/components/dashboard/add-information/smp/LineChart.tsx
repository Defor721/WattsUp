import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

interface LineChartProps {
  data: { name: string; value: number }[]; // 데이터 배열
  xKey: string; // X축 데이터 키
  yKey: string; // Y축 데이터 키
  lineColor: string; // 라인 색상
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  xKey,
  yKey,
  lineColor,
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey={xKey} />
        <YAxis tickFormatter={formatNumberWithoutDecimal} />
        <Tooltip
          formatter={(value: number) =>
            `${formatNumberWithoutDecimal(value)} 회`
          }
          itemStyle={{
            color: "#000000", // 텍스트를 항상 검은색으로 설정
          }}
          labelStyle={{
            color: "#000000", // 레이블(년도)을 항상 검은색으로 설정
          }}
        />
        <Legend />
        <Line type="monotone" dataKey={yKey} stroke={lineColor} name="횟수" />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
