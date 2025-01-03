"use client";

import React, { useState } from "react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/shadcn";
import Title from "@/components/ui/Title";

import PowerGenerationByPowerSource from "@/components/dashboard/main/power-generation-by-power-source/PowerGenerationByPowerSource";
import Economic from "@/components/dashboard/main/economic/Economic";
import SMP from "@/components/dashboard/main/smp/Smp";
import People from "@/components/dashboard/main/people/People";
import Failures from "@/components/dashboard/main/failures/Failures";
import PowerUsageByRegion from "@/components/dashboard/main/power-usage-by-region/PowerUsageByRegion";
import Electro from "@/components/dashboard/main/electro/Electro";
import PowerGeneration from "@/components/dashboard/main/power-generation/PowerGeneration";
import PowerPrice from "@/components/dashboard/main/power-price/PowerPrice";
import Sales from "@/components/dashboard/main/sales/Sales";

interface TodoItem {
  id: number;
  작성자: string;
  목표전력량: number;
  목표가격: number;
  목표입찰금액: number;
  대시보드주제: string;
}

function DashboardPage() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [kpi, setKpi] = useState({
    목표전력량: "",
    목표가격: "",
    목표입찰금액: "",
  });
  const [author, setAuthor] = useState("");
  const [extra, setExtra] = useState("");
  const [recommended, setRecommended] = useState<string[]>([]);
  const [selectedDashboard, setSelectedDashboard] =
    useState<string>("SMP 결정 횟수");

  const dashboards = [
    {
      name: "SMP 결정 횟수",
      path: "/dashboard/smp",
      tags: ["전력", "가격"],
    },
    {
      name: "경제 지표",
      path: "/dashboard/economic",
      tags: ["경제", "가격"],
    },
    {
      name: "국민 계정",
      path: "/dashboard/people",
      tags: ["통계", "계정"],
    },
    {
      name: "발전원별 시간별 발전량",
      path: "/dashboard",
      tags: ["발전량"],
    },
    {
      name: "발전원별 연도별 발전량",
      path: "/dashboard/power-generation",
      tags: ["발전량", "전력"],
    },

    {
      name: "유형별 전기 고장 추이",
      path: "/dashboard/failures",
      tags: ["고장", "유형"],
    },

    {
      name: "전력 사용량 시도별",
      path: "/dashboard/power-usage-by-region",
      tags: ["지역", "전력"],
    },
    {
      name: "전력 지표",
      path: "/dashboard/electro",
      tags: ["전력", "전력량"],
    },

    {
      name: "판매 단가",
      path: "/dashboard/power-price",
      tags: ["판매", "가격"],
    },
    {
      name: "판매 금액",
      path: "/dashboard/sales",
      tags: ["판매", "금액"],
    },
  ];

  interface DashboardComponents {
    [key: string]: React.FC;
  }

  const dashboardComponents: DashboardComponents = {
    "SMP 결정 횟수": SMP,
    "경제 지표": Economic,
    "국민 계정": People,
    "발전원별 시간별 발전량": PowerGenerationByPowerSource,
    "발전원별 연도별 발전량": PowerGeneration,
    "유형별 전기 고장 추이": Failures,
    "전력 사용량 시도별": PowerUsageByRegion,
    "전력 지표": Electro,
    "판매 단가": PowerPrice,
    "판매 금액": Sales,
  };

  return (
    <div className="p-5 dark:bg-subColor">
      <Title title={`${selectedDashboard} 대시보드`} />
      {/* 대시보드 선택 */}
      <div className="flex items-center justify-end gap-3">
        <div className="text-mainColor dark:text-white">대시보드 선택</div>
        <Select value={selectedDashboard} onValueChange={setSelectedDashboard}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="대시보드 선택" />
          </SelectTrigger>
          <SelectContent>
            {dashboards.map((dashboard) => (
              <SelectItem
                className="bg-white dark:bg-subColor"
                key={dashboard.name}
                value={dashboard.name}
              >
                {dashboard.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* 대시보드 보여주는 곳 */}
      <div>
        {dashboardComponents[selectedDashboard] ? (
          React.createElement(dashboardComponents[selectedDashboard])
        ) : (
          <p>대시보드를 선택해주세요.</p>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
