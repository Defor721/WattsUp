import {
  BarChart,
  Bar,
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

interface BarChartProps {
  data: PowerSupplyData[];
}

export function BarChartComponent({ data }: BarChartProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>시간대별 전력수급 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
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
              <Bar dataKey="supply" fill="#FF85A1" name="공급" />
              <Bar dataKey="demand" fill="#42C9FF " name="수요" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
