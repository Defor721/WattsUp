"use client";

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
  return (
    <div className="flex h-screen flex-col p-5">
      <motion.div
        className="flex flex-1 flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4 scroll-m-20 text-3xl font-semibold tracking-tight text-mainColor first:mt-0 dark:text-white">
          태양광 전력 거래소
        </h2>

        {/* 상단 거래 현황 */}
        <Card className="mb-4 border-none shadow-md backdrop-blur-md">
          <CardContent className="py-2">
            <TradingStats />
          </CardContent>
        </Card>

        {/* 하단 섹션: 차트와 입찰 폼 */}
        <div className="flex w-full gap-4">
          {/* 왼쪽 섹션: 차트 (2/3 너비) */}
          <Card className="flex w-2/3 flex-col border-none bg-white/10 shadow-md backdrop-blur-md">
            <CardContent className="flex-1 py-2">
              <SupplyChart />
            </CardContent>
          </Card>

          {/* 오른쪽 섹션: 입찰 폼 (1/3 너비) */}
          <motion.div
            className="flex w-1/3 flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="flex-1 border-none bg-white/10 shadow-md backdrop-blur-md">
              <CardContent className="flex-1 py-2">
                <BidForm />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
