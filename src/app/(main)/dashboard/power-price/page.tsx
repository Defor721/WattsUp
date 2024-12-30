"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

import KPICard from "@/components/dashboard/page6/KPICard";
import BarChart from "@/components/dashboard/page6/BarChart";
import PieChart from "@/components/dashboard/page6/PieChart";
import Table from "@/components/dashboard/page6/Table";

interface DataRow {
  연도: number;
  주택용: number;
  일반용: number;
  교육용: number;
  산업용: number;
  농사용: number;
  가로등: number;
  심야: number;
  합계: number;
  [key: string]: string | number;
}

const SalesPriceDashboard = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [currentData, setCurrentData] = useState<DataRow | null>(null);

  // 데이터 불러오기
  useEffect(() => {
    const loadData = async () => {
      const response = await fetch("/assets/dashboards/HOME_Sales price.xlsx");
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
        type: "array",
      });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: DataRow[] = XLSX.utils
        .sheet_to_json(worksheet)
        .map((row: any) => ({
          연도: Number(row["연도"]),
          주택용: Number(row["주택용"]),
          일반용: Number(row["일반용"]),
          교육용: Number(row["교육용"]),
          산업용: Number(row["산업용"]),
          농사용: Number(row["농사용"]),
          가로등: Number(row["가로등"]),
          심야: Number(row["심야"]),
          합계: Number(row["합계"]),
        }));
      setData(jsonData);
      setSelectedYear(jsonData[0]?.연도 || 2023);
      setCurrentData(jsonData[0]);
    };

    loadData();
  }, []);

  // 연도 변경
  useEffect(() => {
    const yearData = data.find((row) => row.연도 === selectedYear);
    setCurrentData(yearData || null);
  }, [selectedYear, data]);

  // 데이터 다운로드
  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SalesPrice");
    XLSX.writeFile(workbook, "SalesPriceData.xlsx");
  };

  // 차트 데이터 생성
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

  const generatePieChartData = () => ({
    labels: [
      "주택용",
      "일반용",
      "교육용",
      "산업용",
      "농사용",
      "가로등",
      "심야",
    ],
    datasets: [
      {
        label: "비중",
        data: currentData
          ? [
              currentData.주택용,
              currentData.일반용,
              currentData.교육용,
              currentData.산업용,
              currentData.농사용,
              currentData.가로등,
              currentData.심야,
            ]
          : [],
        backgroundColor: [
          "#34D399",
          "#60A5FA",
          "#F87171",
          "#93C5FD",
          "#FBBF24",
          "#A78BFA",
          "#FCA5A5",
        ],
      },
    ],
  });

  const kpiConfig = {
    주택용: { color: "#34D399", unit: "원" },
    일반용: { color: "#60A5FA", unit: "원" },
    산업용: { color: "#F87171", unit: "원" },
    합계: { color: "#93C5FD", unit: "원" },
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <h1 className="mb-6 text-center text-4xl font-bold">
        판매 가격 대시보드
      </h1>

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
        <button
          onClick={handleDownload}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          데이터 다운로드
        </button>
      </div>

      {currentData && (
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Object.entries(currentData)
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

      <div className="flex flex-col gap-6">
        <div className="w-full">
          <BarChart data={generateBarChartData("합계")} />
        </div>
        <div className="w-full">
          <PieChart data={generatePieChartData()} />
        </div>
      </div>

      <div className="mt-6">
        <Table data={data.slice(0, 10)} />
      </div>
    </div>
  );
};

export default SalesPriceDashboard;
