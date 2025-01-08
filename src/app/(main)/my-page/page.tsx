"use client";

import {
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/shadcn";
import Info from "@/components/my-page/Info";
import Stats from "@/components/my-page/Stats";
import RecentLog from "@/components/my-page/RecentLog";

const monthlyTradeData = [
  { month: "1월", amount: 3200 },
  { month: "2월", amount: 4500 },
  { month: "3월", amount: 3800 },
  { month: "4월", amount: 5100 },
  { month: "5월", amount: 4700 },
  { month: "6월", amount: 5600 },
];

export default function Mypage() {
  return (
    <div className="mx-auto flex max-w-[1024px] flex-col items-center gap-3 p-5">
      <h2 className="pointer-events-none select-none scroll-m-20 pt-5 text-3xl font-semibold tracking-tight text-mainColor first:mt-0 dark:text-white">
        마이 페이지
      </h2>

      <Info />

      <Separator className="bg-gray-200" />

      <div className="flex w-full flex-col gap-3">
        <Stats />

        <Separator className="bg-gray-200" />

        <RecentLog />
      </div>
    </div>
  );
}
