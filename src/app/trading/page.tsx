"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale, // x축 스케일
  LinearScale, // y축 스케일
  PointElement,
  LineElement,
  BarElement, // 바 차트를 사용하려면 추가
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Chart } from "react-chartjs-2";

import { Button } from "@/components/shadcn/button";
import { Card } from "@/components/shadcn/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);
type EnergyData = {
  Time: string;
  "Demand (MWh)": number;
  "Supply (MWh)": number;
  "Energy Transacted (MWh)": number;
  "Price ($/MWh)": number;
};

export default function TradingView() {
  const [timeInterval, setTimeInterval] = useState("30분");
  const [orderType, setOrderType] = useState("buy");
  const [orderAmount, setOrderAmount] = useState("");
  const [orderPrice, setOrderPrice] = useState("");
  const [chartData, setChartData] = useState<ChartData<"line">>();
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/trade/tradedata"); // API 엔드포인트
        const { data } = await res.json();
        const labels = data.map((item: { Time: string }) => item.Time); // Time 데이터를 x축으로 사용
        const demandData = data.map(
          (item: { "Demand (MWh)": number }) => item["Demand (MWh)"],
        ); // y축 데이터
        const supplyData = data.map(
          (item: { "Supply (MWh)": number }) => item["Supply (MWh)"],
        );
        const priceData = data.map(
          (item: { "Price ($/MWh)": number }) => item["Price ($/MWh)"],
        );

        // Chart.js 데이터 설정
        setChartData({
          labels, // x축 레이블
          datasets: [
            {
              label: "Demand (MWh)",
              data: demandData,
              borderColor: "rgba(255, 99, 132, 1)", // 대비가 강한 테두리 색
              backgroundColor: "rgba(255, 99, 132, 0.5)", // 투명도 낮춤
              borderWidth: 2, // 선 두께 증가
            },
            {
              label: "Supply (MWh)",
              data: supplyData,
              borderColor: "rgba(54, 162, 235, 1)",
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderWidth: 2,
            },
          ],
        });
      } catch (error) {
        console.error("데이터 로드 에러:", error);
      }
    }

    fetchData();
  }, []);
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
    <div className="flex min-h-screen flex-col p-4">
      <h1 className="mb-8 text-5xl font-bold">Trading</h1>
      {/* Header */}
      {/* <header className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8"></div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">로그인</Button>
              <Button>회원가입</Button>
            </div>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="hidden w-80 border-r lg:block">
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-bold">실시간 시세</span>
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
            {chartData ? (
              <Chart
                type="line"
                data={chartData}
                options={{ responsive: true }}
              />
            ) : (
              <p>데이터 로딩 중...</p>
            )}

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
