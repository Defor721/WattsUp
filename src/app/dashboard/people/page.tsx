"use client";

import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import * as XLSX from "xlsx";

interface DataRow {
  연도: number;
  [key: string]: number;
}

const EconomicDashboard = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("전체");
  const [kpi, setKpi] = useState({
    경제성장률: 0,
    국민총소득: 0,
    총저축률: 0,
    국내총투자율: 0,
  });
  const [selectedChart1, setSelectedChart1] = useState("국내총생산(10억원)");
  const [selectedChart2, setSelectedChart2] = useState("경제성장률(%)");
  const [selectedChart3, setSelectedChart3] = useState("1인당 국민총소득(US$)");
  const [selectedChart4, setSelectedChart4] = useState("총저축률(%)");

  const chartOptions = [
    "국내총생산(10억원)",
    "국민총소득(10억원)",
    "1인당 국민총소득(US$)",
    "경제성장률(%)",
    "총저축률(%)",
    "국내총투자율(%)",
  ];

  // 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/assets/HOME_주요지표_국민계정.xlsx");
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
        type: "array",
      });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: DataRow[] = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
    };
    fetchData();
  }, []);

  // KPI 업데이트
  useEffect(() => {
    const filtered =
      selectedYear === "전체"
        ? data
        : data.filter((row) => row.연도 === Number(selectedYear));
    if (filtered.length) {
      const latest = filtered[0];
      setKpi({
        경제성장률: latest["경제성장률(%)"],
        국민총소득: latest["1인당 국민총소득(US$)"],
        총저축률: latest["총저축률(%)"],
        국내총투자율: latest["국내총투자율(%)"],
      });
    }
  }, [selectedYear, data]);

  const generateChart = (metric: string) => ({
    x: data.map((row) => row.연도),
    y: data.map((row) => row[metric]),
    type: "scatter",
    mode: "lines+markers",
    name: metric,
  });

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8f9fa",
        padding: "20px",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#007bff" }}>
        국민계정 대시보드
      </h1>

      {/* 연도 선택 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          <option value="전체">전체</option>
          {data.map((row) => (
            <option key={row.연도} value={row.연도}>
              {row.연도}
            </option>
          ))}
        </select>
      </div>

      {/* KPI 카드 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: "20px",
        }}
      >
        {Object.entries(kpi).map(([key, value]) => (
          <div
            key={key}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #007bff",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#007bff" }}>{key}</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>
              {value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* 차트 섹션 */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* 차트 1 */}
        <div>
          <h3>라인 차트</h3>
          <select
            value={selectedChart1}
            onChange={(e) => setSelectedChart1(e.target.value)}
          >
            {chartOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <Plot
            data={[generateChart(selectedChart1)]}
            layout={{ title: selectedChart1 }}
          />
        </div>

        {/* 차트 2 */}
        <div>
          <h3>바 차트</h3>
          <select
            value={selectedChart2}
            onChange={(e) => setSelectedChart2(e.target.value)}
          >
            {chartOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <Plot
            data={[generateChart(selectedChart2)]}
            layout={{ title: selectedChart2, type: "bar" }}
          />
        </div>

        {/* 차트 3 */}
        <div>
          <h3>스캐터 차트</h3>
          <select
            value={selectedChart3}
            onChange={(e) => setSelectedChart3(e.target.value)}
          >
            {chartOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <Plot
            data={[generateChart(selectedChart3)]}
            layout={{ title: selectedChart3 }}
          />
        </div>

        {/* 차트 4 */}
        <div>
          <h3>영역 차트</h3>
          <select
            value={selectedChart4}
            onChange={(e) => setSelectedChart4(e.target.value)}
          >
            {chartOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <Plot
            data={[generateChart(selectedChart4)]}
            layout={{ title: selectedChart4, type: "area" }}
          />
        </div>
      </div>
    </div>
  );
};

export default EconomicDashboard;
