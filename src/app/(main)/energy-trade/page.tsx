"use client";

import { useState, useEffect } from "react";

import {
  Card,
  CardHeader,
  CardContent,
  Skeleton,
  Button,
} from "@/components/shadcn"; // 공통 컴포넌트 모듈화
import {
  StatusCards,
  BarChartComponent,
  LineChartComponent,
  DataTable,
  Forecast,
} from "@/components/energy-trade";
import {
  mockPowerSupplyData,
  mockPowerForecastData,
} from "@/components/energy-trade/mock/helpers";
import { BidCountCard } from "@/components/energy-trade/BidCountCard";
import { TradingModal } from "@/components/energy-trade/TradingModal";

type GraphType = "bar" | "line" | "table" | "forecast";

export default function Dashboard() {
  const [supplyData, setSupplyData] = useState(mockPowerSupplyData()); // 초기 공급 데이터 설정 (더미 데이터 사용)
  const [forecastData, setForecastData] = useState(mockPowerForecastData()); // 초기 예측 데이터 설정 (더미 데이터 사용)
  const [selectedGraph, setSelectedGraph] = useState<GraphType>("bar"); // 현재 선택된 그래프 유형 상태 관리
  const [isTradingModalOpen, setIsTradingModalOpen] = useState(false); // 거래 모달의 열림 상태 관리
  const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태 관리

  // 컴포넌트 마운트 시 데이터 로딩 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500); // 500ms 후 로딩 완료 상태로 전환
    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  if (isLoading) {
    // 로딩 상태에서 Skeleton 컴포넌트 렌더링
    return (
      <div className="grid grid-cols-1 gap-4 p-4">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <Card key={i} className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <Skeleton className="h-4 w-full max-w-[250px]" />{" "}
                {/* 헤더 로딩 UI */}
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full max-w-[200px]" />{" "}
                {/* 컨텐츠 로딩 UI */}
              </CardContent>
            </Card>
          ))}
      </div>
    );
  }

  const currentSupply = supplyData[supplyData.length - 1]; // 최신 공급 데이터 가져오기

  // 선택된 그래프 유형에 따라 렌더링할 컴포넌트를 반환
  const renderGraph = () => {
    switch (selectedGraph) {
      case "bar":
        return <BarChartComponent />;
      case "table":
        return (
          <div className="h-full overflow-auto">
            <DataTable data={supplyData} /> {/* 데이터 테이블 렌더링 */}
          </div>
        );
      case "line":
        return <LineChartComponent data={supplyData} />;
      case "forecast":
        return <Forecast data={forecastData} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-8">
      {/* 헤더 섹션 */}
      <header className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold text-[rgb(7,15,38)]">
          Electricity Transaction Status {/* 헤더 타이틀 */}
        </h1>
        <BidCountCard /> {/* 거래 카운트 카드 */}
      </header>

      {/* 현재 전력 상태 카드 섹션 */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCards currentSupply={currentSupply} />
      </div>

      {/* 그래프 및 거래 버튼 섹션 */}
      <div className="mb-6">
        <div className="flex items-center">
          <span className="text-lg font-bold">시간대별 전력수급 현황</span>{" "}
          {/* 섹션 제목 */}
          <Button
            onClick={() => setIsTradingModalOpen(true)} // 거래 모달 열기
            className="ml-4 rounded-md border border-[rgb(7,15,38)] bg-white px-6 py-2 font-semibold text-[rgb(7,15,38)] hover:scale-105 hover:bg-[rgb(7,15,38)] hover:text-white"
          >
            거래하기 {/* 거래 버튼 */}
          </Button>
        </div>

        {/* 그래프 유형 선택 버튼 */}
        <div className="mt-4 flex flex-wrap gap-2">
          {["bar", "table", "line", "forecast"].map((type) => (
            <Button
              key={type} // React에서 리스트 렌더링 시 고유한 키를 설정하기 위해 사용 - type은 반복 렌더링하는 항목의 고유 식별자로 사용
              onClick={() => setSelectedGraph(type as GraphType)} // 그래프 유형 선택
              variant={selectedGraph === type ? "outline" : "default"} // 선택된 그래프 스타일 적용
            >
              {
                {
                  bar: "막대 그래프",
                  table: "리스트",
                  line: "수요/공급 추이",
                  forecast: "전력수급 예측",
                }[type as GraphType] // 버튼 레이블
              }
            </Button>
          ))}
        </div>
      </div>

      {/* 선택된 그래프 렌더링 */}
      <div className="bg-card rounded-lg p-4">{renderGraph()}</div>

      {/* 거래 모달 */}
      <TradingModal
        isOpen={isTradingModalOpen} // 거래 모달 열림 상태
        onClose={() => setIsTradingModalOpen(false)} // 거래 모달 닫기
      />
    </div>
  );
}
