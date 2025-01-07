"use client"; // Next.js 클라이언트 컴포넌트로 설정

import { useEffect, useState } from "react"; // React 훅 가져오기
import { motion } from "framer-motion"; // 애니메이션 라이브러리

// 데이터 타입 정의 (TypeScript)
type TradingStatsData = {
  bidCount: number; // 총 입찰 수
  smp: number; // SMP
  rec: number; // REC
  totalSupply: number; // 총 공급량
};

// 거래 통계 컴포넌트
export default function TradingStats() {
  const [stats, setStats] = useState<TradingStatsData | null>(null); // 거래 통계 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // API 호출 주석 처리
        /*
        const [bidCount, smp, totalSupply] = await Promise.all([
          axios.get<number>("/api/trade/countbid").then((res) => res.data),
          axios.get<number>("/api/trade/smp").then((res) => res.data),
          axios.get<number>("/api/trade/supply").then((res) => res.data),
        ]);

        setStats({ bidCount, smp, totalSupply }); // 상태 업데이트
        */

        // 임시 데이터 설정
        setStats({
          bidCount: 150, // 총 입찰 수
          smp: 130, // SMP
          rec: 65.0, // REc
          totalSupply: 5000, // 총 공급량
        });
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setError("데이터를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setIsLoading(false); // 로딩 상태 해제
      }
    };

    fetchStats();
  }, []);

  if (isLoading) return <LoadingMessage />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="w-full"
    >
      <div className="p-6">
        {/* <h2 className="text-2xl font-bold">거래 통계</h2> */}
        <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-4">
          <StatItem title="누적 입찰 수" value={stats?.bidCount || 0} />
          <StatItem
            title="SMP"
            value={`${stats?.smp.toLocaleString()} 원/kWh`}
          />
          <StatItem
            title="REC"
            value={`${stats?.rec.toLocaleString()} 원/REC`}
          />
          <StatItem
            title="총 공급량"
            value={`${stats?.totalSupply.toLocaleString()} kWh`}
          />
        </div>
      </div>
    </motion.div>
  );
}

// 로딩 메시지 컴포넌트
function LoadingMessage() {
  return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
    </div>
  );
}

// 에러 메시지 컴포넌트
function ErrorMessage({ error }: { error: string }) {
  return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-red-500">{error}</p>
    </div>
  );
}

// 개별 통계 항목 컴포넌트
function StatItem({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-200">
        {title}
      </p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">
        {value}
      </p>
    </div>
  );
}
