"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios"; // HTTP 요청 라이브러리

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";

// 데이터 타입 정의 (TypeScript 사용)
interface SupplyData {
  region: string; // 지역 이름
  supply: number; // 전력 공급량
}

// SupplyChart 컴포넌트
export default function SupplyChart() {
  // 상태 관리
  const [data, setData] = useState<SupplyData[]>([]); // 지역별 데이터
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 메시지

  // 데이터 가져오기 (API 호출)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const regions = [
          "서울",
          "경기",
          "인천",
          "강원",
          "충북",
          "충남",
          "대전",
          "경북",
          "경남",
          "대구",
          "울산",
          "부산",
          "전북",
          "전남",
          "광주",
          "제주",
        ];

        // 병렬 API 호출로 모든 지역의 데이터를 가져오기
        const responses = await Promise.all(
          regions.map(
            (region) =>
              axios
                .get<number>(`/api/trade/supply/${region}`)
                .then((res) => res.data), // 각 지역에 대한 데이터 가져오기
          ),
        );

        // 데이터 정리 및 상태 업데이트
        setData(
          regions.map((region, index) => ({
            region, // 지역 이름
            supply: responses[index], // 해당 지역의 공급량
          })),
        );
      } catch (error) {
        console.error("Failed to fetch supply data:", error); // 콘솔에 오류 출력
        setError("데이터를 가져오는 중 문제가 발생했습니다."); // 사용자에게 에러 메시지 표시
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    };

    fetchData(); // 컴포넌트 마운트 시 데이터 가져오기
  }, []);

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
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // 초기 애니메이션
      animate={{ opacity: 1, y: 0 }} // 완료된 애니메이션
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
          {/* ResponsiveContainer로 반응형 차트 생성 */}
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              {/* X축: 지역 */}
              <XAxis dataKey="region" />
              {/* Y축: 공급량 */}
              <YAxis />
              {/* 차트 툴팁 */}
              <Tooltip />
              {/* 바 그래프 */}
              <Bar
                dataKey="supply"
                fill="rgb(13,23,53)" // 차트 색상
                radius={[4, 4, 0, 0]} // 둥근 모서리
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
