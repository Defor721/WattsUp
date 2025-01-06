"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios"; // Axios를 가져오기

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card"; // UI 카드 컴포넌트

// 타입 정의
interface TradingStatsData {
  bidCount: number;
  smp: number;
  totalSupply: number;
}

export default function TradingStats() {
  const [stats, setStats] = useState<TradingStatsData>({
    bidCount: 0,
    smp: 0,
    totalSupply: 0,
  });
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // API 병렬 호출
        const [bidCountRes, smpRes, totalSupplyRes] = await Promise.all([
          axios.get("/api/trade/countbid").then((res) => res.data), // 총 입찰 수
          axios.get("/api/trade/smp").then((res) => res.data), // SMP
          axios.get("/api/trade/supply").then((res) => res.data), // 총 공급량
        ]);

        // 상태 업데이트
        setStats({
          bidCount: bidCountRes,
          smp: smpRes,
          totalSupply: totalSupplyRes,
        });
      } catch (error) {
        console.error("Failed to fetch trading stats:", error);
        setError("데이터를 가져오는 중 문제가 발생했습니다.");
      } finally {
        setIsLoading(false); // 로딩 상태 해제
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // 초기 애니메이션 상태
      animate={{ opacity: 1, y: 0 }} // 완료된 애니메이션 상태
      transition={{ duration: 0.5 }} // 애니메이션 지속 시간
      className="w-full"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">거래 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <StatItem title="총 입찰 수" value={stats.bidCount} />
            <StatItem
              title="SMP"
              value={`${stats.smp.toLocaleString()} 원/kWh`}
            />
            <StatItem
              title="총 공급량"
              value={`${stats.totalSupply.toLocaleString()} kWh`}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// 개별 통계 항목 컴포넌트
function StatItem({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
