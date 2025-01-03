"use client";

import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn";

const tradeData = [
  { name: "입찰 성공", value: 35 },
  { name: "입찰 실패", value: 25 },
];

const COLORS = ["#0f1d4b", "#4c6ef5", "#82c91e", "#fcc419"];

function Stats() {
  const [successTrade, setSuccessTrade] = useState(80);

  return (
    <Card className="flex flex-col border-0 shadow-none">
      <CardHeader>
        <CardTitle>개요 및 상세정보</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <Tabs defaultValue="overview">
          <TabsList className="gap-3">
            <TabsTrigger value="overview" className="w-[190px]">
              개요
            </TabsTrigger>
            <TabsTrigger value="details" className="w-[190px]">
              상세 정보
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card className="p-5">
              <div className="flex items-center justify-between gap-5">
                {/* 개요 */}
                <div className="flex flex-col gap-2">
                  <div>
                    <div className="">총 거래 횟수</div>
                    <div className="flex items-center gap-1">
                      <div className="text-lg font-semibold">{1346}</div>
                      <small className="text-sm font-medium leading-none">
                        회
                      </small>
                    </div>
                  </div>
                  <div>
                    <div className="">총 입찰 건수</div>
                    <div className="flex items-center gap-1">
                      <div className="text-lg font-semibold">{123}</div>
                      <small className="text-sm font-medium leading-none">
                        건
                      </small>
                    </div>
                  </div>
                  <div>
                    <div className="">총 전력 거래량</div>
                    <div className="flex items-center gap-1">
                      <div className="text-lg font-semibold">{4000}</div>
                      <small className="text-sm font-medium leading-none">
                        mWh
                      </small>
                    </div>
                  </div>
                </div>

                {/* 차트 */}
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={tradeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {tradeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="details">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div className="">평균 거래 단가</div>
                <div className="flex items-center gap-1">
                  <div className="text-lg font-semibold">{75.2}</div>
                  <small className="text-sm font-medium leading-none">
                    원/kWh
                  </small>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="">최대 거래량</div>
                <div className="flex items-center gap-1">
                  <div className="text-lg font-semibold">{450}</div>
                  <small className="text-sm font-medium leading-none">MW</small>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="">거래 성사율</div>
                <div className="flex items-center gap-1">
                  <div className="text-lg font-semibold">{successTrade}</div>
                  <small className="text-sm font-medium leading-none">%</small>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span>거래 성사율</span>
              <span>{successTrade}%</span>
            </div>
            <Progress value={successTrade} className="h-full bg-rose-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Stats;
