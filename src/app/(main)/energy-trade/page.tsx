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
} from "@/components/energy-trade/mock/types";
import {
  mockPowerSupplyData,
  mockPowerForecastData,
} from "@/components/energy-trade/mock/helpers";
import { StatusCards } from "@/components/energy-trade/StatusCards";
import { BarChartComponent } from "@/components/energy-trade/BarChart";
import { LineChartComponent } from "@/components/energy-trade/LineChart";
import { DataTable } from "@/components/energy-trade/DataTable";
import { Forecast } from "@/components/energy-trade/Forecast";
import { TradingModal } from "@/components/energy-trade/TradingModal";

type GraphType = "bar" | "line" | "table" | "forecast";

export default function Dashboard() {
  const [supplyData, setSupplyData] = useState<PowerSupplyData[]>([]);
  const [forecastData, setForecastData] = useState<PowerForecastData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGraph, setSelectedGraph] = useState<GraphType>("bar");
  const [isTradingModalOpen, setIsTradingModalOpen] = useState(false);

  useEffect(() => {
    setSupplyData(mockPowerSupplyData());
    setForecastData(mockPowerForecastData());
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <Skeleton className="h-4 w-full max-w-[250px]" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full max-w-[200px]" />
              <Skeleton className="h-4 w-full max-w-[200px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>오류 발생</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const currentSupply = supplyData[supplyData.length - 1];

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="mb-6 text-center text-3xl font-bold text-[rgb(7,15,38)]">
          Electricity Transaction Status
        </h1>
      </div>

      {/* Status Cards */}
      <StatusCards currentSupply={currentSupply} />

      {/* Graph Controls */}
      <div className="mb-6">
        <div className="flex">
          <span className="mb-4 block text-lg font-medium">
            시간대별 전력수급 현황
          </span>
          <Button
            onClick={() => setIsTradingModalOpen(true)}
            className="mx-4 rounded-md border border-[rgb(7,15,38)] bg-white px-6 py-2 font-semibold text-[rgb(7,15,38)] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-[rgb(7,15,38)] hover:text-white hover:shadow-lg"
          >
            거래하기
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex flex-wrap gap-2">
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
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedGraph("line")}
              variant={selectedGraph === "line" ? "outline" : "default"}
            >
              수요/공급 추이
            </Button>
            <Button
              onClick={() => setSelectedGraph("forecast")}
              variant={selectedGraph === "forecast" ? "outline" : "default"}
            >
              전력수급 예측
            </Button>
          </div>
        </div>
      </div>

      {/* Charts/Table */}
      <div className="bg-card rounded-lg border">
        <div className="h-full w-full p-4">
          {selectedGraph === "bar" && <BarChartComponent data={supplyData} />}
          {selectedGraph === "line" && <LineChartComponent data={supplyData} />}
          {selectedGraph === "table" && (
            <div className="h-full overflow-auto">
              <DataTable data={supplyData} />
            </div>
          )}
          {selectedGraph === "forecast" && <Forecast data={forecastData} />}
        </div>
      </div>

      {/* Trading Modal */}
      <TradingModal
        isOpen={isTradingModalOpen}
        onClose={() => setIsTradingModalOpen(false)}
      />
    </div>
  );
}
