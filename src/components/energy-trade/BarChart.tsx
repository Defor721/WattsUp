"use client";

import axios from "axios";
import { useEffect, useState } from "react";
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
import { PowerSupplyData } from "@/components/energy-trade/mock/types";

export function BarChartComponent() {
  const [data, setData] = useState<PowerSupplyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/trade/tradedata");
      setData(response.data);
    } catch (err: any) {
      setError(err.message || "데이터를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="flex h-[400px] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-8">
        <CardContent className="flex h-[400px] items-center justify-center">
          <div className="text-center text-red-500">
            <p className="mb-2 text-lg font-semibold">오류 발생</p>
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="supply"
                fill="#FF85A1"
                name="공급"
                barSize={15}
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={1500}
              />
              <Bar
                dataKey="demand"
                fill="#42C9FF"
                name="수요"
                barSize={15}
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
