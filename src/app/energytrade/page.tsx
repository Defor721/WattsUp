"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { Skeleton } from "@/components/shadcn/skeleton";
import {
  PowerSupplyData,
  PowerForecastData,
} from "@/components/energytrade/mock/types";
import {
  mockPowerSupplyData,
  mockPowerForecastData,
} from "@/components/energytrade/mock/helpers";
import { StatusCards } from "@/components/energytrade/StatusCards";
import { BarChartComponent } from "@/components/energytrade/BarChart";
import { LineChartComponent } from "@/components/energytrade/LineChart";
import { DataTable } from "@/components/energytrade/DataTable";
import { Forecast } from "@/components/energytrade/Forecast";

type GraphType = "bar" | "line" | "table" | "forecast";

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

  return (
    <div className="p-4">
      <h1 className="mb-8 text-5xl font-bold">
        Electricity Transaction Status
      </h1>

      <StatusCards currentSupply={currentSupply} />

      <div className="mb-4 flex gap-4 space-x-2">
        <div className="flex gap-4">
          <span className="text-lg font-bold">시간대별 전력수급 현황</span>
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
        <span className="mt-2">|</span>
        <Button
          className="text-lg font-bold"
          onClick={() => setSelectedGraph("line")}
          variant={selectedGraph === "line" ? "outline" : "default"}
        >
          시간대별 전력 수요 및 공급 추이
        </Button>
        <span className="mt-2">|</span>
        <Button
          className="text-lg font-bold"
          onClick={() => setSelectedGraph("forecast")}
          variant={selectedGraph === "forecast" ? "outline" : "default"}
        >
          전력수급 예측
        </Button>
      </div>

      {selectedGraph === "bar" && <BarChartComponent data={supplyData} />}
      {selectedGraph === "line" && <LineChartComponent data={supplyData} />}
      {selectedGraph === "table" && <DataTable data={supplyData} />}
      {selectedGraph === "forecast" && <Forecast data={forecastData} />}
    </div>
  );
}
