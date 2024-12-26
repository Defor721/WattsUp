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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";

import { formatNumber } from "@/components/energytrade/mock/helpers";
import { PowerForecastData } from "@/components/energytrade/mock/types";

interface ForecastProps {
  data: PowerForecastData[];
}

export function Forecast({ data }: ForecastProps) {
  return (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>전력수급 예측</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex">
            <div className="w-1/3 pr-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="text-lg">
                      <TableHead className="w-[200px]">시간</TableHead>
                      <TableHead>예측 수요(MW)</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>
              <div className="max-h-[340px] overflow-y-auto">
                <Table>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="w-[220px]">{item.time}</TableCell>
                        <TableCell>
                          {formatNumber(item.forecastDemand)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="w-2/3 pl-4">
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
                      dataKey="forecastDemand"
                      stroke="#8884d8"
                      name="예측 수요"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
