"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Card } from "@/components/shadcn/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";

export default function TradingView() {
  const [timeInterval, setTimeInterval] = useState("30분");
  const [orderType, setOrderType] = useState("buy");
  const [orderAmount, setOrderAmount] = useState("");
  const [orderPrice, setOrderPrice] = useState("");

  const getOrderButtonClass = () => {
    return orderType === "buy"
      ? "bg-green-500 hover:bg-green-600 text-white"
      : "bg-red-500 hover:bg-red-600 text-white";
  };

  const handleOrder = (type: "buy" | "sell") => {
    // Here you would implement the logic to place the order
    console.log(`Placing ${type} order for ${orderAmount} at ${orderPrice}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8"></div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">로그인</Button>
              <Button>회원가입</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="hidden w-80 border-r lg:block">
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-medium">실시간 시세</span>
              <Button variant="ghost" size="sm">
                설정
              </Button>
            </div>
            {/* Market Pairs */}
            <div className="space-y-2">
              {[
                {
                  name: "원자력",
                  price: "143,699,000",
                  change: -0.2,
                  volume: "12,844",
                },
                {
                  name: "LNG",
                  price: "5,458,000",
                  change: 2.75,
                  volume: "186,548",
                },
                {
                  name: "유류",
                  price: "3,421",
                  change: -5.39,
                  volume: "1,455,185",
                },
              ].map((pair) => (
                <Card key={pair.name} className="p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{pair.name}</div>
                      <div
                        className={
                          pair.change >= 0 ? "text-red-500" : "text-blue-500"
                        }
                      >
                        {pair.price}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={
                          pair.change >= 0 ? "text-red-500" : "text-blue-500"
                        }
                      >
                        {pair.change}%
                        {pair.change >= 0 ? (
                          <ArrowUp className="ml-1 inline h-4 w-4" />
                        ) : (
                          <ArrowDown className="ml-1 inline h-4 w-4" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {pair.volume}백만
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Chart Area */}
        <main className="flex-1 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">원자력</h1>
              <p className="text-gray-500">거래량: 8,589 (억원)</p>
            </div>
          </div>

          {/* Chart Controls */}
          <div className="mb-4">
            <Tabs value={timeInterval} onValueChange={setTimeInterval}>
              <TabsList>
                <TabsTrigger value="1분">1분</TabsTrigger>
                <TabsTrigger value="10분">10분</TabsTrigger>
                <TabsTrigger value="30분">30분</TabsTrigger>
                <TabsTrigger value="1시간">1시간</TabsTrigger>
                <TabsTrigger value="일">일</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Chart Placeholder */}
          <div className="relative flex h-[75%] items-center justify-center rounded-lg bg-gray-100">
            Chart Area
            {/* Buy/Sell Order Form */}
            <Card className="absolute bottom-4 right-4 w-80 p-4">
              <Tabs
                value={orderType}
                onValueChange={setOrderType as (value: string) => void}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="buy"
                    className="border text-black data-[state=active]:bg-green-500 data-[state=active]:text-white"
                  >
                    매수
                  </TabsTrigger>
                  <TabsTrigger
                    value="sell"
                    className="border text-black data-[state=active]:bg-red-500 data-[state=active]:text-white"
                  >
                    매도
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="amount">수량</Label>
                  <Input
                    id="amount"
                    placeholder="0.00"
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="price">가격</Label>
                  <Input
                    id="price"
                    placeholder="0"
                    value={orderPrice}
                    onChange={(e) => setOrderPrice(e.target.value)}
                  />
                </div>
                <Button
                  className={`w-full ${getOrderButtonClass()}`}
                  onClick={() => handleOrder(orderType as "buy" | "sell")}
                >
                  {orderType === "buy" ? "매수" : "매도"}
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
