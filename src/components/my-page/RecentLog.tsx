import React from "react";
import {
  Ban,
  Bell,
  Calendar,
  CircleCheck,
  DollarSign,
  FileText,
  Loader,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn";

const data = [
  {
    icon: Zap,
    text: "거래 완료: 1.2 GWh (75원/kWh)",
    time: "2시간 전",
  },
  { icon: FileText, text: "월간 보고서 제출", time: "1일 전" },
  { icon: Bell, text: "새로운 시장 공지사항", time: "3일 전" },
  {
    icon: DollarSign,
    text: "정산 완료: 9,000,000원",
    time: "4일 전",
  },
  {
    icon: TrendingUp,
    text: "거래량 목표 달성: 100GWh",
    time: "1주일 전",
  },
  {
    icon: Calendar,
    text: "다음 달 거래 계획 수립",
    time: "2주일 전",
  },
];

function RecentLog() {
  return (
    <Card className="flex flex-col border-0 shadow-none">
      <CardHeader>
        <CardTitle>최근 활동</CardTitle>
      </CardHeader>
      <CardContent>
        <Card className="p-5">
          {/* <ul className="flex flex-col gap-4">
            {data.map((activity, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(15,30,75)] dark:border-1">
                  <activity.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.text}</p>
                  <p className="text-muted-foreground text-xs">
                    {activity.time}
                  </p>
                </div>
              </li>
            ))}
          </ul> */}
          <ul className="flex flex-col gap-3">
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col">
                <div>{"서울"}발전소 400 kMh</div>
                <div>2시간 전</div>
              </div>
              <div className="flex gap-2 rounded-md bg-rose-400 p-2 text-rose-700">
                <Ban />
                <div>rejected</div>
              </div>
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col">
                <div>{"부산"}발전소 600 kMh</div>
                <div>3시간 전</div>
              </div>
              <div className="flex gap-2 rounded-md bg-amber-200 p-2 text-amber-700">
                <Loader />
                <div>pending</div>
              </div>
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col">
                <div>{"대구"}발전소 1000 kMh</div>
                <div>4시간 전</div>
              </div>
              <div className="flex gap-2 rounded-md bg-green-400 p-2 text-green-700">
                <CircleCheck />
                <div>approve</div>
              </div>
            </div>
          </ul>
        </Card>
      </CardContent>
    </Card>
  );
}

export default RecentLog;
