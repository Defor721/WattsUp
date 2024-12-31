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
import Energy from "@/components/dashboard/main/energy/Energy";
import Failures from "@/components/dashboard/main/failures/Failures";
import Cost from "@/components/dashboard/main/cost/Cost";
import PowerUsage from "@/components/dashboard/main/power-usage/PowerUsage";
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
    useState<string>("유형별 전기 고장 추이");

  const dashboards = [
    {
      name: "SMP",
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
      name: "발전원별 발전량",
      path: "/dashboard",
      tags: ["발전량"],
    },
    {
      name: "에너지 지표",
      path: "/dashboard/energy",
      tags: ["에너지", "효율"],
    },
    {
      name: "유형별 전기 고장 추이",
      path: "/dashboard/failures",
      tags: ["고장", "유형"],
    },
    {
      name: "전력 거래 연료 비용",
      path: "/dashboard/cost",
      tags: ["연료", "비용"],
    },
    {
      name: "전력 사용량 계약 종별",
      path: "/dashboard/power-usage",
      tags: ["전력", "사용량"],
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
      name: "전원별 발전량",
      path: "/dashboard/power-generation",
      tags: ["발전량", "전력"],
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

  const handleAddTodo = () => {
    if (author && kpi.목표전력량 && kpi.목표가격 && kpi.목표입찰금액) {
      const newTodo: TodoItem = {
        id: todos.length + 1,
        작성자: author,
        목표전력량: parseInt(kpi.목표전력량),
        목표가격: parseInt(kpi.목표가격),
        목표입찰금액: parseInt(kpi.목표입찰금액),
        대시보드주제: extra,
      };

      setTodos([...todos, newTodo]);
      setKpi({ 목표전력량: "", 목표가격: "", 목표입찰금액: "" });
      setAuthor("");
      setExtra("");

      // 추천 로직 실행
      recommendDashboards(newTodo);
    }
  };

  const recommendDashboards = (todo: TodoItem) => {
    const keywords = [
      todo.목표전력량.toString(),
      todo.목표가격.toString(),
      todo.목표입찰금액.toString(),
      todo.대시보드주제.toLowerCase(),
    ];

    const matches = dashboards.filter((dashboard) =>
      dashboard.tags.some((tag) =>
        keywords.some((keyword) => tag.includes(keyword.toLowerCase())),
      ),
    );

    setRecommended(matches.map((dashboard) => dashboard.name));
  };

  interface DashboardComponents {
    [key: string]: React.FC;
  }

  const dashboardComponents: DashboardComponents = {
    SMP: SMP,
    "경제 지표": Economic,
    "국민 계정": People,
    "발전원별 발전량": PowerGenerationByPowerSource,
    "에너지 지표": Energy,
    "유형별 전기 고장 추이": Failures,
    "전력 거래 연료 비용": Cost,
    "전력 사용량 계약 종별": PowerUsage,
    "전력 사용량 시도별": PowerUsageByRegion,
    "전력 지표": Electro,
    "전원별 발전량": PowerGeneration,
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
      {/* <div className="mb-10 p-4"> */}
      {/* <h1 className="mb-6 text-center text-3xl font-bold text-[rgb(7,15,38)]">
          대시보드 관리
        </h1> */}

      {/* KPI 입력 섹션 */}
      {/* <div className="mb-6 flex flex-wrap justify-center gap-4">
          <input
            type="text"
            placeholder="작성자 이름"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="rounded-lg border border-gray-300 p-2"
          />
          <input
            type="number"
            placeholder="목표 전력량 (kWh)"
            value={kpi.목표전력량}
            onChange={(e) => setKpi({ ...kpi, 목표전력량: e.target.value })}
            className="rounded-lg border border-gray-300 p-2"
          />
          <input
            type="number"
            placeholder="목표 가격 (₩)"
            value={kpi.목표가격}
            onChange={(e) => setKpi({ ...kpi, 목표가격: e.target.value })}
            className="rounded-lg border border-gray-300 p-2"
          />
          <input
            type="number"
            placeholder="목표 입찰금액 (₩)"
            value={kpi.목표입찰금액}
            onChange={(e) => setKpi({ ...kpi, 목표입찰금액: e.target.value })}
            className="rounded-lg border border-gray-300 p-2"
          />
          <input
            type="text"
            placeholder="대시보드 주제"
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            className="rounded-lg border border-gray-300 p-2"
          />
          <button
            onClick={handleAddTodo}
            className="rounded-lg bg-[rgb(7,15,38)] p-2 px-4 text-white transition-colors hover:bg-opacity-90"
          >
            추가
          </button>
        </div> */}

      {/* TODO 리스트 테이블  */}
      {/* <div className="overflow-x-auto">
          <table className="w-full overflow-hidden rounded-lg bg-white shadow-md">
            <thead className="bg-[rgb(7,15,38)] text-white">
              <tr>
                <th className="p-3 text-center">ID</th>
                <th className="p-3 text-center">작성자</th>
                <th className="p-3 text-center">목표 전력량</th>
                <th className="p-3 text-center">목표 가격</th>
                <th className="p-3 text-center">목표 입찰금액</th>
                <th className="p-3 text-center">대시보드 주제</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr key={todo.id} className="border-b border-gray-200">
                  <td className="p-3 text-center">{todo.id}</td>
                  <td className="p-3 text-center">{todo.작성자}</td>
                  <td className="p-3 text-center">{todo.목표전력량} kWh</td>
                  <td className="p-3 text-center">
                    ₩{todo.목표가격.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    ₩{todo.목표입찰금액.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">{todo.대시보드주제}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
      {/* </div> */}
      {/* 대시보드 선택 버튼 */}
      {/* <div className="border-rgb(7,15,38) border p-4"> */}
      {/* <h1 className="m-8 text-center text-3xl font-bold text-[rgb(7,15,38)]">
          대시보드 선택
        </h1> */}
      {/* <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {dashboards.map((dashboard) => (
            <motion.div
              key={dashboard.name}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
            >
              <Link
                href={dashboard.path}
                className="block rounded-lg border border-gray-200 bg-white p-4 text-center font-bold text-[rgb(7,15,38)] shadow-md transition-all hover:scale-105 hover:bg-gray-50"
              >
                {dashboard.name}
              </Link>
            </motion.div>
          ))}
        </motion.div> */}
      {/* </div> */}
    </div>
  );
}

export default DashboardPage;
