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
import axios from "axios"; // HTTP 요청 라이브러리

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card"; // UI 카드 컴포넌트
import { Regions } from "@/utils/regions"; // Regions 배열 가져오기

// 데이터 타입 정의
interface SupplyData {
  region: string; // 지역 이름
  supply: number; // 전력 공급량
}

// SupplyChart 컴포넌트
export default function SupplyChart() {
  const [data, setData] = useState<SupplyData[]>([]); // 데이터 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

  useEffect(() => {
    // 데이터 가져오기 함수
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          Regions.map(
            (region) =>
              axios
                .get<number>(`/api/trade/supply/${region}`)
                .then((res) => res.data), // 지역별 API 호출
          ),
        );

        // 데이터 설정
        setData(
          Regions.map((region, index) => ({
            region,
            supply: responses[index],
          })),
        );
      } catch (err) {
        console.error("데이터 로드 실패:", err); // 에러 출력
        setError("데이터를 불러오는 중 문제가 발생했습니다."); // 에러 메시지 설정
      } finally {
        setIsLoading(false); // 로딩 상태 해제
      }
    };

    fetchData(); // 데이터 로드
  }, []); // 컴포넌트 마운트 시 실행

  // 로딩 상태일 때
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 에러 상태일 때
  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // 초기 애니메이션
      animate={{ opacity: 1, y: 0 }} // 완료 애니메이션
      transition={{ duration: 0.5 }} // 애니메이션 지속 시간
      className="w-full"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            지역별 전력 공급량
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <XAxis dataKey="region" /> {/* X축: 지역 */}
              <YAxis /> {/* Y축: 공급량 */}
              <Tooltip /> {/* 툴팁 */}
              <Bar
                dataKey="supply"
                fill="rgb(13,23,53)" // 바 색상
                radius={[4, 4, 0, 0]} // 모서리 둥글게
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
