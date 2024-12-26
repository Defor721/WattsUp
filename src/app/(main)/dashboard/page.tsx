"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Separator } from "@radix-ui/react-separator";
import { motion } from "framer-motion"; // Add this import

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
    }
  };

  const dashboards = [
    { name: "경제 지표 대시보드", path: "/dashboard/economic" },
    { name: "전력지표 대시보드", path: "/dashboard/electro" },
    { name: "에너지지표 대시보드", path: "/dashboard/energy" },
    { name: "국민계정 대시보드", path: "/dashboard/people" },
    { name: "SMP 대시보드", path: "/dashboard/smp" },
    { name: "전력사용량_계약종별 대시보드", path: "/dashboard/power-usage" },
    {
      name: "전력사용량_시도별 대시보드",
      path: "/dashboard/power-usage-by-region",
    },
    { name: "전원별발전량 대시보드", path: "/dashboard/power-generation" },
    { name: "판매단가 대시보드", path: "/dashboard/power-price" },
    { name: "판매금액 대시보드", path: "/dashboard/sales" },
  ];

  // Add these variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
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
                    <td className="p-3">{todo.id}</td>
                    <td className="p-3">{todo.작성자}</td>
                    <td className="p-3">{todo.목표전력량} kWh</td>
                    <td className="p-3">₩{todo.목표가격.toLocaleString()}</td>
                    <td className="p-3">
                      ₩{todo.목표입찰금액.toLocaleString()}
                    </td>
                    <td className="p-3">{todo.대시보드주제}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 대시보드 선택 버튼 */}
        <div className="border-rgb(7,15,38) border p-4">
          <h1 className="m-8 text-center text-3xl font-bold text-[rgb(7,15,38)]">
            대시보드 선택
          </h1>
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {dashboards.map((dashboard) => (
              <motion.div key={dashboard.name} variants={itemVariants}>
                <Link
                  href={dashboard.path}
                  className="my-2 block rounded-lg border border-gray-200 bg-white p-4 text-center font-bold text-[rgb(7,15,38)] shadow-md transition-all hover:scale-105 hover:bg-gray-50"
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
