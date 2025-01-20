"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn";
import Loading from "@/app/loading";
import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

import useFetchUserTradeData from "./useFetchUserData";

function Stats() {
  const { data, loading } = useFetchUserTradeData();

  if (loading) return <Loading />;

  if (!data) return <div>거래 기록이 없습니다.</div>;

  const stats = data.stats;
  const formattedCount = formatNumberWithoutDecimal(stats.documentCount);
  const formattedPrice = formatNumberWithoutDecimal(stats.totalPrice);
  const formattedQuantity = formatNumberWithoutDecimal(stats.totalQuantity);

  return (
    <div className="flex flex-col">
      <CardHeader>
        <CardTitle>개요 및 상세정보</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <Tabs defaultValue="overview">
          <TabsList className="gap-3">
            <TabsTrigger value="overview" className="w-[190px]">
              개요
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card className="border-none bg-cardBackground-light p-cardPadding dark:bg-cardBackground-dark">
              {/* 개요 */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="">총 거래 횟수</div>
                  <div className="flex items-center gap-1">
                    <div className="text-lg font-semibold">
                      {formattedCount}
                    </div>
                    <small className="text-sm font-medium leading-none">
                      회
                    </small>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="">총 거래 금액</div>
                  <div className="flex items-center gap-1">
                    <div className="text-lg font-semibold">
                      {formattedPrice}
                    </div>
                    <small className="text-sm font-medium leading-none">
                      원
                    </small>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="">총 전력 거래량</div>
                  <div className="flex items-center gap-1">
                    <div className="text-lg font-semibold">
                      {formattedQuantity}
                    </div>
                    <small className="text-sm font-medium leading-none">
                      kWh
                    </small>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  );
}

export default Stats;
