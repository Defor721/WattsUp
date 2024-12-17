"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import * as XLSX from "xlsx";

// Plotly를 dynamic import로 처리하여 서버 사이드 렌더링(SSR) 제외
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface EconomicData {
  연도: number;
  "생산자물가지수(2015=100)": number;
  "소비자물가지수(2020=100)": number;
  "경상수지(백만US$)": number;
  "환율(원/US$)": number;
  "수출액(백만US$)": number;
  "수입액(백만US$)": number;
  "실업률(%)": number;
}

const Dashboard = () => {
  const [data, setData] = useState<EconomicData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [filteredData, setFilteredData] = useState<EconomicData | null>(null);

  // 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/data");
        setData(response.data);

        // 가장 최신 연도를 기본값으로 설정
        const latestYear = Math.max(
          ...response.data.map((d: EconomicData) => d.연도),
        );
        setSelectedYear(latestYear);
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchData();
  }, []);

  // 선택된 연도에 따라 데이터를 필터링
  useEffect(() => {
    if (selectedYear !== null) {
      const filtered = data.find((d) => d.연도 === selectedYear);
      setFilteredData(filtered || null);
    }
  }, [selectedYear, data]);

  // 데이터를 다운로드하는 함수
  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "경제지표");
    XLSX.writeFile(workbook, "경제지표_데이터.xlsx");
  };

  if (!filteredData) {
    return <p>Loading...</p>;
  }

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        backgroundColor: "#1d1f21",
      }}
    >
      <h1 style={{ color: "#4dabf7" }}>경제지표 대시보드</h1>

      {/* 드롭다운과 다운로드 버튼 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <select
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          value={selectedYear || ""}
          style={{ padding: "10px", fontSize: "16px" }}
        >
          {data.map((item) => (
            <option key={item.연도} value={item.연도}>
              {item.연도}년
            </option>
          ))}
        </select>
        <button
          onClick={handleDownload}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4dabf7",
            color: "#fff",
          }}
        >
          데이터 다운로드
        </button>
      </div>

      {/* KPI 카드 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#282c34",
            padding: "20px",
            borderRadius: "8px",
            width: "30%",
          }}
        >
          <h3>생산자물가지수 (2015=100)</h3>
          <p>{filteredData["생산자물가지수(2015=100)"]}</p>
        </div>
        <div
          style={{
            backgroundColor: "#282c34",
            padding: "20px",
            borderRadius: "8px",
            width: "30%",
          }}
        >
          <h3>소비자물가지수 (2020=100)</h3>
          <p>{filteredData["소비자물가지수(2020=100)"]}</p>
        </div>
        <div
          style={{
            backgroundColor: "#282c34",
            padding: "20px",
            borderRadius: "8px",
            width: "30%",
          }}
        >
          <h3>경상수지 (백만 US$)</h3>
          <p>{filteredData["경상수지(백만US$)"].toLocaleString()} 백만 US$</p>
        </div>
      </div>

      {/* 그래프 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        <div
          style={{
            flex: "1 1 45%",
            backgroundColor: "#282c34",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>환율 추이</h3>
          <Plot
            data={[
              {
                x: data.map((d) => d.연도),
                y: data.map((d) => d["환율(원/US$)"]),
                type: "scatter",
                mode: "lines+markers",
                marker: { color: "#4dabf7" },
              },
            ]}
            layout={{
              title: "연도별 환율 추이",
              paper_bgcolor: "#282c34",
              font: { color: "#ffffff" },
            }}
          />
        </div>
        <div
          style={{
            flex: "1 1 45%",
            backgroundColor: "#282c34",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>수출 및 수입 비교</h3>
          <Plot
            data={[
              {
                x: ["수출", "수입"],
                y: [
                  filteredData["수출액(백만US$)"],
                  filteredData["수입액(백만US$)"],
                ],
                type: "bar",
                marker: { color: ["#4dabf7", "#ffb347"] },
              },
            ]}
            layout={{
              title: "수출 및 수입",
              paper_bgcolor: "#282c34",
              font: { color: "#ffffff" },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
