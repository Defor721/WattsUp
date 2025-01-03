"use client";

import { useRouter } from "next/navigation";
import {
  Settings,
  LogOut,
  Zap,
  FileText,
  Bell,
  DollarSign,
  TrendingUp,
  Calendar,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import { useState, useRef } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/avatar";
import { Button } from "@/components/shadcn/button";
import { Progress } from "@/components/shadcn/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/tabs";
import { Input } from "@/components/shadcn/input";

const tradeData = [
  { name: "실시간 거래", value: 35 },
  { name: "선물 거래", value: 25 },
  { name: "장외 거래", value: 30 },
  { name: "기타", value: 10 },
];

const COLORS = ["#0f1d4b", "#4c6ef5", "#82c91e", "#fcc419"];

const monthlyTradeData = [
  { month: "1월", amount: 3200 },
  { month: "2월", amount: 4500 },
  { month: "3월", amount: 3800 },
  { month: "4월", amount: 5100 },
  { month: "5월", amount: 4700 },
  { month: "6월", amount: 5600 },
];

export default function Mypage() {
  const router = useRouter();
  const [avatarSrc, setAvatarSrc] = useState("/assets/images/logo.webp");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-4 sm:p-6">
      <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">마이페이지</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-1 flex flex-col items-center border-0 pt-20 md:col-span-1">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar
              className="h-24 w-24 cursor-pointer"
              onClick={handleAvatarClick}
            >
              <AvatarImage src={avatarSrc} alt="김터빈" />
              <AvatarFallback>김터빈</AvatarFallback>
            </Avatar>
            <Input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
            <CardTitle className="mt-4">김터빈</CardTitle>
            <CardDescription>김터빈@gmail.com</CardDescription>
          </CardHeader>
          <CardContent className="flex w-full flex-col items-center">
            <div className="flex w-full flex-col justify-center gap-3 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => router.push("/edit-profile")}
                className="w-full border-[rgb(40,70,150)] hover:bg-slate-100 sm:w-auto"
              >
                <Settings className="mr-2 h-4 w-4" />
                프로필 수정
              </Button>
              <Button
                variant="outline"
                className="w-full border-[rgb(40,70,150)] hover:bg-slate-100 sm:w-auto"
              >
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>통계 및 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview" className="hover:bg-slate-100">
                  개요
                </TabsTrigger>
                <TabsTrigger value="details" className="hover:bg-slate-100">
                  상세 정보
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-sm">총 거래 횟수</span>
                      <span className="text-2xl font-bold sm:text-3xl">
                        1,347
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm">총 입찰 건수</span>
                      <span className="text-2xl font-bold sm:text-3xl">
                        2,156
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm">거래량</span>
                      <span className="text-2xl font-bold sm:text-3xl">
                        5.67 GWh
                      </span>
                    </div>
                  </div>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
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
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {tradeData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                          <span className="text-xs">{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="details">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">평균 거래 단가</span>
                    <span className="text-lg font-semibold">75.2원/kWh</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">최대 거래량</span>
                    <span className="text-lg font-semibold">450 MW</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">거래 성사율</span>
                    <span className="text-lg font-semibold">92.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">평균 정산 시간</span>
                    <span className="text-lg font-semibold">2.3시간</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="mt-20 space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>월간 목표</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="bg-slate-300" />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>효율성 평가</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="bg-slate-300" />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>거래 내역 수</span>
                  <span>1,347 / 2,000</span>
                </div>
                <Progress value={67} className="bg-slate-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>월간 거래량 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTradeData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#4C6EFF"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
