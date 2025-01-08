import React from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DataItem {
  연도: number;
  값: number;
}

interface AreaChartProps {
  data: DataItem[]; // Recharts에서 사용할 데이터 형식
  xKey: keyof DataItem; // x축 키 (ex: 연도)
  yKey: keyof DataItem; // y축 키 (ex: 값)
}

const AreaChartFillByValue: React.FC<AreaChartProps> = ({
  data,
  xKey,
  yKey,
}) => {
  // Calculate gradient offset
  const gradientOffset = () => {
    const dataMax = Math.max(...data.map((item) => item[yKey]));
    const dataMin = Math.min(...data.map((item) => item[yKey]));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  const offset = gradientOffset();

  return (
    <ResponsiveContainer width="100%" height={400} className="mx-auto">
      <RechartsAreaChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        {/* Define Gradient */}
        <defs>
          <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset={offset} stopColor="#4ADE80" stopOpacity={1} />
            <stop offset={offset} stopColor="#EF4444" stopOpacity={1} />
          </linearGradient>
        </defs>
        <XAxis dataKey={xKey as string} />
        <YAxis />
        <Tooltip formatter={(value: number) => `${value}%`} />
        <Legend />
        <Area
          type="monotone"
          dataKey={yKey as string}
          // stroke="#000"
          fill="url(#splitColor)"
          name="성장률"
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartFillByValue;
