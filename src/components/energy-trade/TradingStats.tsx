/* eslint-disable prettier/prettier */
"use client"; // 클라이언트 컴포넌트로 설정

import { useEffect, useState } from "react"; // React 훅
import { motion } from "framer-motion"; // 애니메이션 라이브러리

import apiClient from "@/lib/axios";

import { Card } from "../shadcn";

type TradingStatsData = {
  bidCount: number; // 누적 입찰 수
  smpAverage: number; // SMP 평균가
  recAverage: number; // REC 평균가
  totalSupply: number; // 총 공급량
};

export default function TradingStats({
  isSubmitting,
}: {
  isSubmitting: boolean;
}) {
  const [stats, setStats] = useState<TradingStatsData | null>(null); // 거래 통계 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bidCountResponse, supplyResponse, crawlResponse] =
          await Promise.all([
            apiClient.get("/api/trade/countbid"), // 누적 입찰 수
            apiClient.get("/api/trade/supply"), // 총 공급량 (total 값 사용)
            apiClient.get("/api/crawl"), // SMP, REC 데이터
          ]);

        const bidCount = bidCountResponse.data.count || 0; // `count`로 접근
        const totalSupply = supplyResponse.data.total || 0; // `total`로 접근
        const { todaySmpData, todayRecData } = crawlResponse.data;

        // 데이터 매핑
        setStats({
          bidCount,
          smpAverage: todaySmpData?.["평균가"] || 0, // SMP 평균가
          recAverage: todayRecData?.["평균가"] || 0, // REC 평균가
          totalSupply, // 총 공급량
        });
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setError("데이터를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [isSubmitting]);

  if (isLoading) return <LoadingMessage />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="w-full"
    >
      <div className="grid grid-cols-1 gap-cardGap md:grid-cols-2 xl:grid-cols-4">
        <StatItem title="누적 입찰 수" value={stats?.bidCount || 0} />
        <StatItem
          title="SMP 평균가"
          value={`${stats?.smpAverage.toLocaleString()} 원/kWh`}
        />
        <StatItem
          title="REC 평균가"
          value={`${stats?.recAverage.toLocaleString()} 원/REC`}
        />
        <StatItem
          title="총 공급량"
          value={`${stats?.totalSupply.toLocaleString()} kWh`}
        />
      </div>
    </motion.div>
  );
}

function LoadingMessage() {
  return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
    </div>
  );
}

function ErrorMessage({ error }: { error: string }) {
  return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-red-500">{error}</p>
    </div>
  );
}

function StatItem({ title, value }: { title: string; value: string | number }) {
  return (
    <Card className="rounded-lg border-none bg-cardBackground-light p-cardPadding dark:border-none dark:bg-cardBackground-dark">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-200">
        {title}
      </p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">
        {value}
      </p>
    </Card>
  );
}
