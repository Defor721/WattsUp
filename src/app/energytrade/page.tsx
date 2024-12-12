"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { Skeleton } from "@/components/shadcn/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import {
  PowerSupplyData,
  PowerForecastData,
} from "@/components/energytrade/types";
import {
  formatNumber,
  mockPowerSupplyData,
  mockPowerForecastData,
} from "@/components/energytrade/helpers";

type GraphType = "bar" | "line" | "table" | "forecast";

const MotionCard = motion(Card);

export default function Dashboard() {
  const [supplyData, setSupplyData] = useState<PowerSupplyData[]>([]);
  const [forecastData, setForecastData] = useState<PowerForecastData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGraph, setSelectedGraph] = useState<GraphType>("bar");

  useEffect(() => {
    // 실제 API 호출 대신 목업 데이터 사용
    setSupplyData(mockPowerSupplyData());
    setForecastData(mockPowerForecastData());
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="grid h-64 grid-cols-1 gap-6 overflow-hidden overflow-y-scroll p-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <Skeleton className="h-4 w-[250px]" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[200px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>오류 발생</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const currentSupply = supplyData[supplyData.length - 1];

  const renderBarChart = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>시간대별 전력수급 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={supplyData}
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
              <Bar dataKey="supply" fill="#8884d8" name="공급" />
              <Bar dataKey="demand" fill="#82ca9d" name="수요" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const renderLineChart = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>시간대별 전력 수요 및 공급 추이</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={supplyData}
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
                stroke="#8884d8"
                name="공급"
              />
              <Line
                type="monotone"
                dataKey="demand"
                stroke="#82ca9d"
                name="수요"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const renderTable = () => (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>시간대별 전력수급 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">시간</TableHead>
                  <TableHead>공급(MW)</TableHead>
                  <TableHead>수요(MW)</TableHead>
                  <TableHead>예비력(MW)</TableHead>
                  <TableHead className="text-right">예비율(%)</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableBody>
                {supplyData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="w-[100px]">{item.time}</TableCell>
                    <TableCell>{formatNumber(item.supply)}</TableCell>
                    <TableCell>{formatNumber(item.demand)}</TableCell>
                    <TableCell>{formatNumber(item.reserve)}</TableCell>
                    <TableCell className="text-right">
                      {item.reserveRate.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderForecast = () => (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>전력수급 예측</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex">
            <div className="w-1/2 pr-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">시간</TableHead>
                      <TableHead>예측 수요(MW)</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableBody>
                    {forecastData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="w-[100px]">{item.time}</TableCell>
                        <TableCell>
                          {formatNumber(item.forecastDemand)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="w-1/2 pl-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={forecastData}
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

  return (
    <div className="p-4">
      <h1 className="mb-8 text-5xl font-bold">
        Electricity Transaction Status
      </h1>

      {/* 실시간 전력수급 현황 */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "현재 수요", value: currentSupply.demand },
          { title: "현재 공급", value: currentSupply.supply },
          { title: "현재 예비력", value: currentSupply.reserve },
          {
            title: "현재 예비율",
            value: currentSupply.reserveRate,
            isPercentage: true,
          },
        ].map((item, index) => (
          <MotionCard
            key={item.title}
            initial={{ opacity: 0, y: 90, x: -10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.9, delay: index * 0.1 }}
          >
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {item.isPercentage
                  ? `${item.value.toFixed(2)}%`
                  : `${formatNumber(item.value)} MW`}
              </p>
            </CardContent>
          </MotionCard>
        ))}
      </div>

      {/* 그래프 선택 버튼 */}
      <div className="mb-4 flex space-x-2">
        <div className="flex flex-col">
          <span className="text-lg"> 시간대별 전력수급 현황 </span>
          <div>
            <Button
              onClick={() => setSelectedGraph("bar")}
              variant={selectedGraph === "bar" ? "outline" : "default"}
            >
              막대 그래프
            </Button>
            <Button
              onClick={() => setSelectedGraph("table")}
              variant={selectedGraph === "table" ? "outline" : "default"}
            >
              리스트
            </Button>
          </div>
        </div>

        <Button
          className="text-lg"
          onClick={() => setSelectedGraph("line")}
          variant={selectedGraph === "line" ? "outline" : "default"}
        >
          시간대별 전력 수요 및 공급 추이
        </Button>
        <Button
          className="text-lg"
          onClick={() => setSelectedGraph("forecast")}
          variant={selectedGraph === "forecast" ? "outline" : "default"}
        >
          전력수급 예측
        </Button>
      </div>

      {/* 선택된 그래프 렌더링 */}
      {selectedGraph === "bar" && renderBarChart()}
      {selectedGraph === "line" && renderLineChart()}
      {selectedGraph === "table" && renderTable()}
      {selectedGraph === "forecast" && renderForecast()}
    </div>
  );
}
