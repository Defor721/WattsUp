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
        const response = await axios.get("/api/trade/supply");
        const result = response.data?.result;

        console.log("Response Data:", response.data); // API 응답 데이터 확인

        if (!result) {
          throw new Error("서버로부터 유효한 데이터를 받지 못했습니다.");
        }

        // 데이터 매핑
        const mappedData = Regions.map((region) => ({
          region,
          supply: typeof result[region] === "number" ? result[region] : 0,
        }));

        console.log("Mapped Data:", mappedData); // 매핑된 데이터 확인
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

  console.log("Final Data for Chart:", data); // 차트에 사용될 최종 데이터 확인

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
