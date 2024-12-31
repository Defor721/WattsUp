"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

import KPICard from "@/components/dashboard/page9/KPICard";
import DoughnutChart from "@/components/dashboard/page9/DoughnutChart";
import LineChart from "@/components/dashboard/page9/LineChart";
import Table from "@/components/dashboard/page9/Table";

interface CustomerData {
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

const CustomerDashboard = () => {
  const [data, setData] = useState<CustomerData[]>([]);
  const [filteredData, setFilteredData] = useState<CustomerData | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [kpi, setKpi] = useState({
    주택용: 0,
    일반용: 0,
    교육용: 0,
    산업용: 0,
    농사용: 0,
    가로등: 0,
    심야: 0,
    합계: 0,
  });

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "/assets/dashboards/HOME_Generation·Sales_Customer Number_Contract Type.xlsx",
        );
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
          type: "array",
        });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: CustomerData[] = XLSX.utils
          .sheet_to_json<CustomerData>(worksheet)
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
        setSelectedYear(jsonData[0]?.연도 || null);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, []);

  // 연도 선택 시 데이터 필터링
  useEffect(() => {
    if (selectedYear !== null) {
      const selectedData = data.find((item) => item.연도 === selectedYear);
      setFilteredData(selectedData || null);

      if (selectedData) {
        setKpi({
          주택용: selectedData.주택용,
          일반용: selectedData.일반용,
          교육용: selectedData.교육용,
          산업용: selectedData.산업용,
          농사용: selectedData.농사용,
          가로등: selectedData.가로등,
          심야: selectedData.심야,
          합계: selectedData.합계,
        });
      } else {
        setKpi({
          주택용: 0,
          일반용: 0,
          교육용: 0,
          산업용: 0,
          농사용: 0,
          가로등: 0,
          심야: 0,
          합계: 0,
        });
      }
    }
  }, [selectedYear, data]);

  // 데이터 다운로드
  const handleDownload = () => {
    if (!filteredData) return;

    const worksheet = XLSX.utils.json_to_sheet([filteredData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Data");
    XLSX.writeFile(workbook, `Customer_Data_${selectedYear}.xlsx`);
  };

  // 도넛 차트 데이터
  const doughnutData = {
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
        data: [
          kpi.주택용,
          kpi.일반용,
          kpi.교육용,
          kpi.산업용,
          kpi.농사용,
          kpi.가로등,
          kpi.심야,
        ],
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
  };

  // 라인 차트 데이터
  const lineChartData = {
    labels: data.map((item) => item.연도.toString()),
    datasets: [
      {
        label: "합계",
        data: data.map((item) => item.합계),
        borderColor: "#34D399",
        backgroundColor: "rgba(52, 211, 153, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white md:p-8">
      <h1 className="mb-6 text-center text-4xl font-bold">
        전력사용량_계약종별 대시보드
      </h1>

      {/* 필터와 다운로드 */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <label className="text-sm text-gray-300">연도 선택:</label>
          <select
            value={selectedYear || ""}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="ml-2 rounded-md bg-gray-800 p-2 text-white"
          >
            {data.map((item) => (
              <option key={item.연도} value={item.연도}>
                {item.연도}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleDownload}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          데이터 다운로드
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Object.keys(kpi).map((key) => (
          <KPICard
            key={key}
            title={key}
            value={(kpi[key as keyof typeof kpi] as number).toLocaleString()}
            unit="명"
            backgroundColor="#3B82F6"
            iconColor="#1D4ED8"
          />
        ))}
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-gray-800 p-4">
          <h2 className="text-lg font-semibold">계약 유형별 비율</h2>
          <DoughnutChart data={doughnutData} />
        </div>
        <div className="rounded-lg bg-gray-800 p-4">
          <h2 className="text-lg font-semibold">연도별 고객 합계 추이</h2>
          <LineChart data={lineChartData} />
        </div>
      </div>

      {/* Table */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">세부 데이터</h2>
        <Table data={filteredData ? [filteredData] : []} />
      </div>
    </div>
  );
};

export default CustomerDashboard;
