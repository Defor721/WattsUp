"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

import LineChart from "@/components/dashboard/page4/LineChart";
import BarChart from "@/components/dashboard/page4/BarChart";
import KPICard from "@/components/dashboard/page5/KPICard";
import RecentOrders from "@/components/dashboard/page5/RecentOrder";
import UsersByCountry from "@/components/dashboard/page4/UserByCountry";

interface DataRow {
  연도: number;
  일반수력: number;
  양수: number;
  소수력: number;
  수력소계: number;
  무연탄: number;
  유연탄: number;
  중유: number;
  가스: number;
  기력소계: number;
  복합화력일반: number;
  복합화력열공급: number;
  복합화력총계: number;
  원자력: number;
  신재생: number;
  집단: number;
  내연력: number;
  기타: number;
  총계: number;
  총발전량: number;
}

const GenerationDashboard = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [currentKPI, setCurrentKPI] = useState<DataRow | null>(null);

  // 데이터 불러오기
  useEffect(() => {
    const loadData = async () => {
      const response = await fetch(
        "/assets/dashboards/HOME_generationQuantity.xlsx",
      );
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
        type: "array",
      });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: DataRow[] = XLSX.utils
        .sheet_to_json(worksheet)
        .map((row: any) => ({
          연도: Number(row["연도"]),
          일반수력: Number(row["일반수력"]),
          양수: Number(row["양수"]),
          소수력: Number(row["소수력"]),
          수력소계: Number(row["수력소계"]),
          무연탄: Number(row["무연탄"]),
          유연탄: Number(row["유연탄"]),
          중유: Number(row["중유"]),
          가스: Number(row["가스"]),
          기력소계: Number(row["기력소계"]),
          복합화력일반: Number(row["복합화력일반"]),
          복합화력열공급: Number(row["복합화력열공급"]),
          복합화력총계: Number(row["복합화력총계"]),
          원자력: Number(row["원자력"]),
          신재생: Number(row["신재생"]),
          집단: Number(row["집단"]),
          내연력: Number(row["내연력"]),
          기타: Number(row["기타"]),
          총계: Number(row["총계"]),
          총발전량: Number(row["총발전량"]),
        }));
      setData(jsonData);
      setSelectedYear(jsonData[0]?.연도 || 2023);
      setCurrentKPI(jsonData[0]);
    };

    loadData();
  }, []);

  // 선택한 연도의 KPI 데이터 업데이트
  useEffect(() => {
    const yearData = data.find((row) => row.연도 === selectedYear);
    setCurrentKPI(yearData || null);
  }, [selectedYear, data]);

  // BarChart 데이터 생성
  const generateBarChartData = (metric: keyof DataRow) => ({
    labels: data.map((row) => row.연도),
    datasets: [
      {
        label: metric,
        data: data.map((row) => row[metric]),
        backgroundColor: "#4ADE80",
      },
    ],
  });

  const generateLineChartData = (metric: keyof DataRow) => ({
    labels: data.map((row) => row.연도),
    datasets: [
      {
        label: metric,
        data: data.map((row) => row[metric]),
        borderColor: "#60A5FA",
        backgroundColor: "rgba(96, 165, 250, 0.2)",
        fill: true,
      },
    ],
  });

  const kpiConfig = {
    일반수력: { color: "#34D399", unit: "MWh" },
    양수: { color: "#60A5FA", unit: "MWh" },
    소수력: { color: "#FBBF24", unit: "MWh" },
    수력소계: { color: "#F87171", unit: "MWh" },
    총발전량: { color: "#93C5FD", unit: "MWh" },
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <h1 className="mb-6 text-center text-4xl font-bold">발전량 대시보드</h1>

      {/* 연도 선택 */}
      <div className="mb-6 flex items-center justify-between">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="rounded-md border border-gray-300 bg-gray-800 p-2 text-white"
        >
          {data.map((row) => (
            <option key={row.연도} value={row.연도}>
              {row.연도}
            </option>
          ))}
        </select>
      </div>

      {/* KPI 카드 */}
      {currentKPI && (
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Object.entries(currentKPI)
            .filter(([key]) => kpiConfig[key as keyof typeof kpiConfig])
            .map(([key, value]) => {
              const config = kpiConfig[key as keyof typeof kpiConfig];
              return (
                <KPICard
                  key={key}
                  title={key}
                  value={`${value.toLocaleString()} ${config.unit}`}
                  backgroundColor={config.color}
                />
              );
            })}
        </div>
      )}

      {/* 차트 섹션 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <BarChart
          data={generateBarChartData("총발전량")}
          title="총 발전량 데이터"
        />
        <LineChart
          data={generateLineChartData("수력소계")}
          title="수력소계 발전 추이"
        />
      </div>

      {/* 최근 데이터 */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <RecentOrders
          data={data.slice(0, 5).map((row) => ({
            연도: row.연도,
            총발전량: row.총발전량,
            상태: row.총발전량 > 500000000 ? "High" : "Low",
          }))}
        />
        <UsersByCountry
          data={data.map((row) => ({
            label: `${row.연도}년`,
            value: row.총발전량,
          }))}
        />
      </div>
    </div>
  );
};

export default GenerationDashboard;
// import React from "react";

// function page() {
//   return <div>page</div>;
// }

// export default page;
