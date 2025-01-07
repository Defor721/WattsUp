"use client"; // Next.js 클라이언트 컴포넌트로 설정

import { useEffect, useState } from "react"; // React 훅 가져오기
import { motion } from "framer-motion"; // 애니메이션 라이브러리
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"; // Recharts 차트 컴포넌트

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card"; // UI 카드 컴포넌트
import { Regions } from "@/utils/regions"; // 지역 리스트

// 데이터 타입 정의
interface SupplyData {
  region: string; // 지역 이름
  supply: number; // 전력 공급량
}

// SupplyChart 컴포넌트
export default function SupplyChart() {
  const [data, setData] = useState<SupplyData[]>([]); // 공급량 데이터 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

  useEffect(() => {
    const fetchData = async () => {
      try {
        // API 호출 주석 처리
        /*
        const responses = await Promise.all(
          Regions.map((region) =>
            axios
              .get<number>(`/api/trade/supply/${region}`)
              .then((res) => res.data),
          ),
        );

        setData(
          Regions.map((region, index) => ({
            region,
            supply: responses[index],
          })),
        );
        */

        // 임시 데이터 설정
        setData([
          { region: "서울", supply: 1200 },
          { region: "부산", supply: 900 },
          { region: "대구", supply: 800 },
          { region: "인천", supply: 750 },
          { region: "광주", supply: 700 },
          { region: "대전", supply: 650 },
          { region: "울산", supply: 600 },
        ]);
      } catch (err) {
        console.error("데이터 로드 실패:", err); // 에러 로그
        setError("데이터를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setIsLoading(false); // 로딩 상태 해제
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <p className="text-center text-gray-500">데이터를 불러오는 중입니다...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="w-full"
    >
      <Card className="border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            지역별 전력 공급량
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="supply"
                fill="rgb(13,23,53)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
