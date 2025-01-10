"use client"; // 클라이언트 컴포넌트 설정

import { useEffect, useState } from "react"; // React 훅
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"; // Recharts 컴포넌트

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card"; // UI 카드 컴포넌트
import { Regions } from "@/utils/regions"; // 지역 리스트 가져오기
import {
  formatNumberWithDecimal,
  formatNumberWithoutDecimal,
} from "@/hooks/useNumberFormatter";
import apiClient from "@/lib/axios";

// 데이터 타입 정의
interface SupplyData {
  region: string; // 지역 이름
  supply: number; // 전력 공급량
}

interface SupplyChartProps {
  selectedRegion: string; // 선택된 지역
  onBarClick: (region: string) => void; // 바 클릭 핸들러
  isSubmitting: boolean;
}

// SupplyChart 컴포넌트
export default function SupplyChart({
  selectedRegion,
  onBarClick,
  isSubmitting,
}: SupplyChartProps) {
  const [data, setData] = useState<SupplyData[]>([]); // 공급량 데이터 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/api/trade/supply"); // API 호출
        const result = response.data?.result;

        if (!result) {
          throw new Error("유효한 데이터를 받지 못했습니다."); // 데이터 유효성 검사
        }

        // 데이터 매핑
        const mappedData = Regions.map((region) => ({
          region,
          supply: result[region] ?? 0, // 값이 없으면 0으로 설정
        }));

        setData(mappedData); // 상태 업데이트
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setError(
          err instanceof Error
            ? err.message
            : "알 수 없는 오류가 발생했습니다.",
        );
      } finally {
        setIsLoading(false); // 로딩 상태 해제
      }
    };

    fetchData(); // 데이터 가져오기 함수 호출
  }, [isSubmitting]);

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 에러 상태 처리
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
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={formatNumberWithoutDecimal}
              />
              <Tooltip
                formatter={(value: number) =>
                  `${formatNumberWithDecimal(value)} kWh`
                }
                labelStyle={{
                  color: "#111", // 각 데이터 항목 텍스트는 흰색
                }}
              />
              <Legend />

              <Bar
                dataKey="supply"
                name="공급량"
                fill="rgb(15,30,75)"
                radius={[4, 4, 0, 0]}
                onClick={(data) => onBarClick(data.region)} // 바 클릭 시 선택된 지역 업데이트
                shape={(props: any) => {
                  const { x, y, width, height, payload } = props;
                  const isSelected = payload.region === selectedRegion;
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={isSelected ? "#f59e0b" : "#1e3b97"} // 선택된 바 색상 변경
                      onClick={() => onBarClick(payload.region)} // 클릭 이벤트 추가
                      style={{ cursor: "pointer" }}
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
