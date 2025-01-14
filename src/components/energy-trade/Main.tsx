"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/shadcn/card";
import TradingStats from "@/components/energy-trade/TradingStats";
import BidForm from "@/components/energy-trade/BidForm";
import SupplyChart from "@/components/energy-trade/SupplyChart";
import apiClient from "@/lib/axios";
import { Regions } from "@/utils/regions";
import Loading from "@/app/loading";

export interface SupplyData {
  region: string; // 지역 이름
  supply: number; // 전력 공급량
}

type TradingStatsData = {
  bidCount: number; // 누적 입찰 수
  todaySmpData: {
    거래량: number;
    거래일: string;
    종가: number;
    최고가: number;
    최저가: number;
    평균가: number;
    전일대비변화: number;
  }; // SMP 평균가
  todayRecData: {
    거래일: string;
    최고가: number;
    최소가: number;
    평균가: number;
  }; // REC 평균가
  totalSupply: number; // 총 공급량
  smpIncrease: number; // 전일대비 smp 증가량
  recIncrease: number; // 전일대비 rec 증가량
};

const fetchUserCredits = async () => {
  try {
    const response = await apiClient.get("/api/users/credit");
    return response.data.credits || 0; // 크레딧 데이터 반환
  } catch (error: any) {
    console.error("크레딧 데이터 로드 실패:", error.message);
    return 0; // 실패 시 0으로 설정
  }
};

const fetchSmpPrice = async () => {
  try {
    const response = await apiClient.get("/api/crawl");
    return response.data.todaySmpData["평균가"] || 0; // SMP 평균가 반환
  } catch (error: any) {
    console.error("SMP 데이터 로드 실패:", error.message);
    return 0; // 실패 시 0으로 설정
  }
};

const fetchRecPrice = async () => {
  try {
    const response = await apiClient.get("/api/crawl");
    return response.data.todayRecData["평균가"] || 0; // Rec 평균가 반환
  } catch (error: any) {
    console.error("SMP 데이터 로드 실패:", error.message);
    return 0; // 실패 시 0으로 설정
  }
};

const fetchSupply = async () => {
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

    return mappedData;
  } catch (err) {
    console.error("데이터 로드 실패:", err);
    return [];
  } finally {
  }
};

const fetchStats = async (): Promise<TradingStatsData | null> => {
  try {
    const [bidCountResponse, supplyResponse, crawlResponse] = await Promise.all(
      [
        apiClient.get("/api/trade/countbid"), // 누적 입찰 수
        apiClient.get("/api/trade/supply"), // 총 공급량 (total 값 사용)
        apiClient.get("/api/crawl"), // SMP, REC 데이터
      ],
    );

    const bidCount = bidCountResponse.data.count || 0; // `count`로 접근
    const totalSupply = supplyResponse.data.total || 0; // `total`로 접근
    const { todaySmpData, todayRecData, smpIncrease, recIncrease } =
      crawlResponse.data;

    return {
      bidCount,
      totalSupply,
      todaySmpData,
      todayRecData,
      smpIncrease,
      recIncrease,
    };
  } catch (err) {
    console.error("데이터 로드 실패:", err);
    return null;
  }
};

function Main() {
  const [isLoading, setIsLoading] = useState(true);

  // TradingStats States
  const [stats, setStats] = useState<TradingStatsData | null>(null); // 거래 통계 상태

  // SupplyChart States
  const [selectedRegion, setSelectedRegion] = useState<string>("서울시"); // 선택된 지역 상태
  const [supply, setSupply] = useState<SupplyData[]>([]);

  // BidForm States
  const [smpPrice, setSmpPrice] = useState<number>(0); // SMP 값 상태
  const [credits, setCredits] = useState<number>(0); // 크레딧 상태 추가
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recPrice, setRecPrice] = useState<number>(0);

  useEffect(() => {
    // 컴포넌트 마운트 시 크레딧 데이터와 SMP 값 가져오기
    const loadData = async () => {
      setIsLoading(true);
      const [stats, supply, userCredits, smpValue, recValue] =
        await Promise.all([
          fetchStats(),
          fetchSupply(),
          fetchUserCredits(),
          fetchSmpPrice(),
          fetchRecPrice(),
        ]);
      setStats(stats);
      setCredits(userCredits);
      setSupply(supply);
      setSmpPrice(smpValue);
      setRecPrice(recValue);
      setIsLoading(false);
    };
    loadData();
  }, [isSubmitting]);

  if (isLoading) return <Loading />;

  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-cardGap">
        {/* 상단 거래 현황 */}

        <TradingStats
          stats={stats}
          supply={supply}
          selectedRegion={selectedRegion}
        />

        {/* 하단 섹션: 차트와 입찰 폼 */}
        <div className="grid w-full grid-cols-1 gap-cardGap md:grid-cols-2 xl:grid-cols-4">
          {/* 왼쪽 섹션: 차트 */}
          <Card className="flex w-full flex-col border-none bg-cardBackground-light backdrop-blur-md dark:bg-cardBackground-dark md:col-span-2 xl:col-span-3">
            <CardContent className="flex-1 py-2">
              <SupplyChart
                selectedRegion={selectedRegion}
                onBarClick={setSelectedRegion} // 바 클릭 핸들러
                supply={supply}
              />
            </CardContent>
          </Card>

          {/* 오른쪽 섹션: 입찰 폼 */}
          <motion.div
            className="flex flex-col md:col-span-2 xl:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="flex-1 border-none bg-cardBackground-light backdrop-blur-md dark:bg-cardBackground-dark">
              <CardContent className="flex-1 py-2">
                <BidForm
                  region={selectedRegion}
                  onRegionChange={setSelectedRegion} // 셀렉터 변경 핸들러
                  isSubmitting={isSubmitting}
                  setIsSubmitting={setIsSubmitting}
                  smpPrice={smpPrice}
                  credits={credits}
                  setCredits={setCredits}
                  fetchUserCredits={fetchUserCredits}
                  supply={supply}
                  recPrice={recPrice}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Main;
