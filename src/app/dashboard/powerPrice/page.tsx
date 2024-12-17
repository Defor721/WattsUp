"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import * as XLSX from "xlsx";
import Plot from "react-plotly.js";
import { useRouter } from "next/navigation";

interface PowerPriceData {
  연도: number;
  주택용: number;
  일반용: number;
  교육용: number;
  산업용: number;
  농사용: number;
  가로등: number;
  심야: number;
  합계: number;
}

const Dashboard = () => {
  const router = useRouter();
  const [data, setData] = useState<PowerPriceData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("주택용");
  const [kpi, setKpi] = useState({
    avgResidential: "",
    maxPriceYear: "",
    overallAvg: "",
  });
  const [lineChartData, setLineChartData] = useState<any[]>([]);
  const [boxPlotData, setBoxPlotData] = useState<any[]>([]);
  const [stackedAreaData, setStackedAreaData] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any>([]);

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "/assets/dashboards/HOME_발전·판매_판매단가.xlsx",
        );
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
          type: "array",
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: PowerPriceData[] = XLSX.utils.sheet_to_json(worksheet);
        setData(jsonData);
      } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
      }
    };

    fetchData();
  }, []);

  // 데이터 분석 및 시각화
  useEffect(() => {
    if (data.length > 0) {
      // KPI 계산
      const avgResidential = (
        data.reduce((sum, row) => sum + (row[selectedCategory] || 0), 0) /
        data.length
      ).toFixed(2);

      const maxPriceYearRow = data.reduce((maxRow, row) =>
        row.합계 > maxRow.합계 ? row : maxRow,
      );
      const overallAvg = (
        data.reduce(
          (sum, row) =>
            sum +
            Object.keys(row)
              .filter((key) => key !== "연도" && key !== "합계")
              .reduce((subSum, key) => subSum + (row[key] || 0), 0),
          0,
        ) /
        (data.length * 7)
      ).toFixed(2);

      setKpi({
        avgResidential: `${avgResidential} 원/kWh`,
        maxPriceYear: `${maxPriceYearRow.연도}년 최고: ${maxPriceYearRow.합계.toFixed(
          2,
        )} 원/kWh`,
        overallAvg: `${overallAvg} 원/kWh`,
      });

      // 라인 차트 데이터
      const lineData = Object.keys(data[0])
        .filter((key) => key !== "연도" && key !== "합계")
        .map((category) => ({
          x: data.map((row) => row.연도),
          y: data.map((row) => row[category]),
          type: "scatter",
          mode: "lines+markers",
          name: category,
        }));
      setLineChartData(lineData);

      // 박스 플롯 데이터
      const meltedData = Object.keys(data[0])
        .filter((key) => key !== "연도" && key !== "합계")
        .map((category) => ({
          x: category,
          y: data.map((row) => row[category]),
          type: "box",
          name: category,
        }));
      setBoxPlotData(meltedData);

      // 스택형 영역 차트 데이터
      const stackedData = Object.keys(data[0])
        .filter((key) => key !== "연도" && key !== "합계")
        .map((category) => ({
          x: data.map((row) => row.연도),
          y: data.map((row) => row[category]),
          stackgroup: "one",
          name: category,
        }));
      setStackedAreaData(stackedData);

      // 히트맵 데이터
      const heatmap = {
        z: Object.keys(data[0])
          .filter((key) => key !== "연도" && key !== "합계")
          .map((category) => data.map((row) => row[category])),
        x: data.map((row) => row.연도),
        y: Object.keys(data[0]).filter(
          (key) => key !== "연도" && key !== "합계",
        ),
        type: "heatmap",
        colorscale: "Blues",
      };
      setHeatmapData([heatmap]);
    }
  }, [data, selectedCategory]);

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        color: "#333",
      }}
    >
      <h1 style={{ color: "#007aff" }}>판매단가 대시보드</h1>

      {/* 홈으로 돌아가기 버튼 */}
      <button
        onClick={() => router.push("/")}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#2ecc71",
          color: "#ffffff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        홈으로 돌아가기
      </button>

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
            backgroundColor: "#17a2b8",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h3>범주별 평균</h3>
          <p style={{ fontSize: "24px" }}>{kpi.avgResidential}</p>
        </div>
        <div
          style={{
            backgroundColor: "#28a745",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h3>최고 판매단가</h3>
          <p style={{ fontSize: "24px" }}>{kpi.maxPriceYear}</p>
        </div>
        <div
          style={{
            backgroundColor: "#dc3545",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h3>전체 평균</h3>
          <p style={{ fontSize: "24px" }}>{kpi.overallAvg}</p>
        </div>
      </div>

      {/* 범주 선택 */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>범주 선택:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px" }}
        >
          {Object.keys(data[0] || {})
            .filter((key) => key !== "연도" && key !== "합계")
            .map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
        </select>
      </div>

      {/* 그래프 섹션 */}
      <div style={{ marginBottom: "40px" }}>
        <Plot
          data={lineChartData}
          layout={{
            title: "연도별 판매단가 추세",
            xaxis: { title: "연도" },
            yaxis: { title: "판매단가 (원/kWh)" },
          }}
        />
      </div>

      <div style={{ marginBottom: "40px" }}>
        <Plot
          data={boxPlotData}
          layout={{
            title: "범주별 판매단가 분포",
            xaxis: { title: "범주" },
            yaxis: { title: "판매단가 (원/kWh)" },
          }}
        />
      </div>

      <div style={{ marginBottom: "40px" }}>
        <Plot
          data={stackedAreaData}
          layout={{
            title: "연도별 판매단가 비중",
            xaxis: { title: "연도" },
            yaxis: { title: "판매단가 (원/kWh)" },
          }}
        />
      </div>

      <div style={{ marginBottom: "40px" }}>
        <Plot
          data={heatmapData}
          layout={{
            title: "히트맵: 연도 및 범주별 판매단가",
            xaxis: { title: "연도" },
            yaxis: { title: "범주" },
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
