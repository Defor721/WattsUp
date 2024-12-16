import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { PowerSupplyData } from "@/components/energytrade/mock/types";

interface LineChartProps {
  data: PowerSupplyData[];
}

export function LineChartComponent({ data }: LineChartProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>시간대별 전력 수요 및 공급 추이</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="supply"
                stroke="#FF85A1"
                name="공급"
              />
              <Line
                type="monotone"
                dataKey="demand"
                stroke="#42C9FF"
                name="수요"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
