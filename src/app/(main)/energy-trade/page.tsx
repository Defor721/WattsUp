"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import TradingStats from "@/components/energy-trade/TradingStats";
import BidForm from "@/components/energy-trade/BidForm";
import SupplyChart from "@/components/energy-trade/SupplyChart";

export default function TradePage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("서울시"); // 선택된 지역 상태

  return (
    <div className="mx-auto flex h-screen max-w-[1920px] flex-col p-5">
      <motion.div
        className="flex flex-1 flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4 scroll-m-20 text-3xl font-semibold tracking-tight text-mainColor first:mt-0 dark:text-white">
          태양광 전력 거래소
        </h2>

        <div className="flex flex-col gap-cardGap">
          {/* 상단 거래 현황 */}

          <TradingStats />

          {/* 하단 섹션: 차트와 입찰 폼 */}
          <div className="flex w-full gap-cardGap">
            {/* 왼쪽 섹션: 차트 */}
            <Card className="flex w-3/4 flex-col border-none bg-white/10 shadow-md backdrop-blur-md">
              <CardContent className="flex-1 py-2">
                <SupplyChart
                  selectedRegion={selectedRegion}
                  onBarClick={setSelectedRegion} // 바 클릭 핸들러
                />
              </CardContent>
            </Card>

            {/* 오른쪽 섹션: 입찰 폼 */}
            <motion.div
              className="flex w-1/4 flex-col"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="flex-1 border-none bg-white/10 shadow-md backdrop-blur-md">
                <CardContent className="flex-1 py-2">
                  <BidForm
                    region={selectedRegion}
                    onRegionChange={setSelectedRegion} // 셀렉터 변경 핸들러
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
