"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
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

import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { Skeleton } from "@/components/shadcn/skeleton";

type TradeData = {
  Time: string;
  "Demand (MWh)": number;
  "Supply (MWh)": number;
  "Energy Transacted (MWh)": number;
  "Price ($/MWh)": number;
};

type ViewMode = "list" | "graph";

export default function Dashboard() {
  const [data, setData] = useState<TradeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  async function fetchData() {
    try {
      const res = await fetch("/api/trade/tradedata");

      if (!res.ok) {
        throw new Error(`API 요청 실패: ${res.status}`);
      }

      const result = await res.json();

      if (!result || !Array.isArray(result.data)) {
        throw new Error("데이터 형식이 올바르지 않습니다");
      }

      setData(result.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "데이터를 불러오는데 실패했습니다",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
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

  if (!data.length) {
    return (
      <Alert>
        <AlertTitle>알림</AlertTitle>
        <AlertDescription>표시할 데이터가 없습니다.</AlertDescription>
      </Alert>
    );
  }

  const renderListView = () => (
    <div className="h-[calc(100vh-200px)] overflow-y-auto">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((item, index) => (
          <Card
            key={item.Time || index}
            className="border-gray-800 bg-gray-900/50"
          >
            <CardHeader>
              <CardTitle className="text-lg">시간: {item.Time}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground text-sm">
                수요량: {item["Demand (MWh)"].toLocaleString()} MWh
              </p>
              <p className="text-muted-foreground text-sm">
                공급량: {item["Supply (MWh)"].toLocaleString()} MWh
              </p>
              <p className="text-muted-foreground text-sm">
                거래 에너지량:{" "}
                {item["Energy Transacted (MWh)"].toLocaleString()} MWh
              </p>
              <p className="text-sm font-medium">
                가격: ${item["Price ($/MWh)"].toFixed(2)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderGraphView = () => (
    <div className="h-[calc(100vh-200px)]">
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
          <XAxis dataKey="Time" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="Demand (MWh)"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="Supply (MWh)"
            stroke="#82ca9d"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="Energy Transacted (MWh)"
            stroke="#ffc658"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="Price ($/MWh)"
            stroke="#ff7300"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="p-4">
      <div className="p-4">
        <Button
          onClick={() => setViewMode("list")}
          variant={viewMode === "list" ? "outline" : "default"}
        >
          리스트로 보기
        </Button>

        <Button
          onClick={() => setViewMode("graph")}
          variant={viewMode === "graph" ? "outline" : "default"}
        >
          그래프로 보기
        </Button>
      </div>
      <div className="space-y-4 border border-gray-500">
        <div className="flex space-x-4"></div>
        {viewMode === "list" ? renderListView() : renderGraphView()}
      </div>
    </div>
  );
}
