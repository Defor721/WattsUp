"use client";

import React, { useState } from "react";
import Link from "next/link";

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
    { name: "전력사용량_계약종별 대시보드", path: "/dashboard/powerUsage" },
    {
      name: "전력사용량_시도별 대시보드",
      path: "/dashboard/powerUsageByRegion",
    },
    { name: "전원별발전량 대시보드", path: "/dashboard/powerGeneration" },
    { name: "판매단가 대시보드", path: "/dashboard/powerPrice" },
    { name: "판매금액 대시보드", path: "/dashboard/sales" },
  ];

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9fafb",
        color: "#333",
      }}
    >
      <h1 style={{ color: "#007aff", textAlign: "center" }}>대시보드 관리</h1>

      {/* KPI 입력 섹션 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="작성자 이름"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />
        <input
          type="number"
          placeholder="목표 전력량 (kWh)"
          value={kpi.목표전력량}
          onChange={(e) => setKpi({ ...kpi, 목표전력량: e.target.value })}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />
        <input
          type="number"
          placeholder="목표 가격 (₩)"
          value={kpi.목표가격}
          onChange={(e) => setKpi({ ...kpi, 목표가격: e.target.value })}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />
        <input
          type="number"
          placeholder="목표 입찰금액 (₩)"
          value={kpi.목표입찰금액}
          onChange={(e) => setKpi({ ...kpi, 목표입찰금액: e.target.value })}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />
        <input
          type="text"
          placeholder="대시보드 주제"
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />
        <button
          onClick={handleAddTodo}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007aff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          추가
        </button>
      </div>

      {/* TODO 리스트 테이블 */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#007aff",
              color: "#fff",
              textAlign: "left",
            }}
          >
            <th style={{ padding: "10px" }}>ID</th>
            <th style={{ padding: "10px" }}>작성자</th>
            <th style={{ padding: "10px" }}>목표 전력량</th>
            <th style={{ padding: "10px" }}>목표 가격</th>
            <th style={{ padding: "10px" }}>목표 입찰금액</th>
            <th style={{ padding: "10px" }}>대시보드 주제</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "10px" }}>{todo.id}</td>
              <td style={{ padding: "10px" }}>{todo.작성자}</td>
              <td style={{ padding: "10px" }}>{todo.목표전력량} kWh</td>
              <td style={{ padding: "10px" }}>
                ₩{todo.목표가격.toLocaleString()}
              </td>
              <td style={{ padding: "10px" }}>
                ₩{todo.목표입찰금액.toLocaleString()}
              </td>
              <td style={{ padding: "10px" }}>{todo.대시보드주제}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 대시보드 선택 버튼 */}
      <h2 style={{ marginTop: "30px", color: "#007aff", textAlign: "center" }}>
        대시보드 선택
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {dashboards.map((dashboard) => (
          <Link
            key={dashboard.name}
            href={dashboard.path}
            style={{
              display: "block",
              padding: "15px",
              backgroundColor: "#f0f8ff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              textAlign: "center",
              textDecoration: "none",
              color: "#007aff",
              fontWeight: "bold",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {dashboard.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
