import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  formatNumberWithDecimal,
  formatNumberWithoutDecimal,
} from "@/hooks/useNumberFormatter";

function LineChart({
  chartData,
  colors,
}: {
  chartData: any;
  colors: Record<string, string>;
}) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsLineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis
          tickFormatter={formatNumberWithoutDecimal}
          domain={[0, "auto"]}
        />
        <Tooltip
          formatter={(value: number) => `${formatNumberWithDecimal(value)} MWh`}
        />
        {Object.keys(chartData[0] || {}).map(
          (key, index) =>
            key !== "hour" && (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[key]}
              />
            ),
        )}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export default LineChart;
