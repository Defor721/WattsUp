"use client"; // Next.js 클라이언트 컴포넌트로 설정

import { useEffect, useState } from "react"; // React의 상태 관리 및 사이드 이펙트 훅
import { motion } from "framer-motion"; // 애니메이션 효과를 위한 라이브러리

// 데이터 타입 정의 (TypeScript)
type TradingStatsData = {
  bidCount: number; // 총 입찰 수
  smp: number; // SMP (System Marginal Price)
  totalSupply: number; // 총 공급량
};

// 거래 통계 컴포넌트
export default function TradingStats() {
  const [stats, setStats] = useState<TradingStatsData | null>(null); // 거래 통계 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    // 데이터 가져오는 비동기 함수
    const fetchStats = async () => {
      try {
        const [bidCount, smp, totalSupply] = await Promise.all([
          // API 호출 병렬 처리
          fetch("/api/trade/countbid").then((res) => res.json()), // 총 입찰 수
          fetch("/api/trade/smp").then((res) => res.json()), // SMP
          fetch("/api/trade/supply").then((res) => res.json()), // 총 공급량
        ]);

        setStats({ bidCount, smp, totalSupply }); // 상태 업데이트
      } catch (err) {
        console.error("데이터 로드 실패:", err); // 에러 로그 출력
        setError("데이터를 불러오는 중 문제가 발생했습니다."); // 에러 메시지 설정
      } finally {
        setIsLoading(false); // 로딩 상태 해제
      }
    };

    fetchStats(); // 데이터 가져오기 실행
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // 로딩 상태일 때 보여줄 컴포넌트
  if (isLoading) return <LoadingMessage />;

  // 에러 상태일 때 보여줄 컴포넌트
  if (error) return <ErrorMessage error={error} />;

  // 데이터 로드 완료 후 UI 렌더링
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // 초기 애니메이션 상태
      animate={{ opacity: 1, y: 0 }} // 애니메이션 완료 상태
      transition={{ duration: 0.5 }} // 애니메이션 지속 시간
      className="w-full"
    >
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          거래 통계
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* 통계 항목들 */}
          <StatItem title="총 입찰 수" value={stats?.bidCount || 0} />
          <StatItem
            title="SMP"
            value={`${stats?.smp.toLocaleString()} 원/kWh`}
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
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
