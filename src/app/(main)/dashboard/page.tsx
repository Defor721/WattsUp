"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface TodoItem {
  id: number;
  작성자: string;
  목표전력량: number;
  목표가격: number;
  목표입찰금액: number;
  대시보드주제: string;
}

const DashboardPage = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [kpi, setKpi] = useState({
    목표전력량: "",
    목표가격: "",
    목표입찰금액: "",
  });
  const [author, setAuthor] = useState("");
  const [extra, setExtra] = useState("");
  const [recommended, setRecommended] = useState<string[]>([]);

  const dashboards = [
    {
      name: "경제 지표 대시보드",
      path: "/dashboard/economic",
      tags: ["경제", "가격"],
    },
    {
      name: "전력지표 대시보드",
      path: "/dashboard/electro",
      tags: ["전력", "전력량"],
    },
    {
      name: "에너지지표 대시보드",
      path: "/dashboard/energy",
      tags: ["에너지", "효율"],
    },
    {
      name: "국민계정 대시보드",
      path: "/dashboard/people",
      tags: ["통계", "계정"],
    },
    { name: "SMP 대시보드", path: "/dashboard/smp", tags: ["전력", "가격"] },
    {
      name: "전력사용량_계약종별 대시보드",
      path: "/dashboard/power-usage",
      tags: ["전력", "사용량"],
    },
    {
      name: "전력사용량_시도별 대시보드",
      path: "/dashboard/power-usage-by-region",
      tags: ["지역", "전력"],
    },
    {
      name: "전원별발전량 대시보드",
      path: "/dashboard/power-generation",
      tags: ["발전량", "전력"],
    },
    {
      name: "판매단가 대시보드",
      path: "/dashboard/power-price",
      tags: ["판매", "가격"],
    },
    {
      name: "판매금액 대시보드",
      path: "/dashboard/sales",
      tags: ["판매", "금액"],
    },
    {
      name: "전력거래_연료비용 대시보드",
      path: "/dashboard/cost",
      tags: ["연료", "비용"],
    },
    {
      name: "유형별전기고장추이 대시보드",
      path: "/dashboard/failures",
      tags: ["고장", "유형"],
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

  return (
    <div className="p-8">
      <h1 className="mb-8 text-5xl font-bold">Dashboard</h1>
      <div className="bg-gray-50 p-5 font-sans text-gray-800">
        <div className="mb-10 p-4">
          <h1 className="mb-6 text-center text-3xl font-bold text-[rgb(7,15,38)]">
            대시보드 관리
          </h1>

          {/* KPI 입력 섹션 */}
          <div className="mb-6 flex flex-wrap justify-center gap-4">
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
          </div>

          {/* 추천 대시보드 */}
          <div className="mb-8">
            <h2 className="mb-4 text-center text-2xl font-bold text-[rgb(7,15,38)]">
              추천 대시보드
            </h2>
            {recommended.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-4">
                {recommended.map((name, index) => (
                  <div
                    key={index}
                    className="rounded-lg bg-blue-100 p-4 text-center font-semibold text-blue-700 shadow-md"
                  >
                    {name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                추천할 대시보드가 없습니다.
              </p>
            )}
          </div>

          {/* TODO 리스트 테이블 */}
          <div className="overflow-x-auto">
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
          </div>
        </div>

        {/* 대시보드 선택 버튼 */}
        <div className="border p-4">
          <h1 className="m-8 text-center text-3xl font-bold text-[rgb(7,15,38)]">
            대시보드 선택
          </h1>
          <motion.div
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
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
