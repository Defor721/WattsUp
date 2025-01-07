"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { Regions } from "@/utils/regions";

interface SupplyData {
  region: string;
  supply: number;
}

export default function SupplyChart() {
  const [data, setData] = useState<SupplyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // API 요청
        const response = await axios.get("/api/trade/supply");
        const result = response.data?.result;

        if (!result) {
          throw new Error("서버로부터 유효한 데이터를 받지 못했습니다.");
        }

        // `result` 객체에서 지역 데이터 추출
        const mappedData = Regions.map((region) => ({
          region,
          supply: result[region] ?? 0, // 지역 데이터가 없을 경우 0으로 기본값 설정
        }));

        setData(mappedData);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setError(
          err instanceof Error
            ? err.message
            : "알 수 없는 오류가 발생했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-center text-gray-500">
          데이터를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="w-full">
      <Card className="border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            지역별 전력 공급량
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              barSize={30}
              margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
            >
              <XAxis dataKey="region" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  color: "#fff",
                  border: "none",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Bar
                dataKey="supply"
                fill="rgb(59, 130, 246)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
