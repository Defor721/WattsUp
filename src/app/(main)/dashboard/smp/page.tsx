"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

import KPICard from "@/components/dashboard/page8/KPICard";
import LineChart from "@/components/dashboard/page8/LineChart";
import Table from "@/components/dashboard/page8/Table";
import DoughnutChart from "@/components/dashboard/main/Chart";

// SMPData 타입 정의
interface SMPData {
  기간: string;
  LNG: number;
  유류: number;
  무연탄: number;
  유연탄: number;
  원자력: number;
  총계: number;
}

const SMPDashboard = () => {
  const [data, setData] = useState<SMPData[]>([]);
  const [filteredData, setFilteredData] = useState<SMPData[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("전체");
  const [selectedFuel, setSelectedFuel] = useState<string>("전체");
  const [kpi, setKpi] = useState<{
    [key in keyof Omit<SMPData, "기간">]: number;
  }>({
    LNG: 0,
    유류: 0,
    무연탄: 0,
    유연탄: 0,
    원자력: 0,
    총계: 0,
  });

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/assets/dashboards/HOME_SMP.xlsx");
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
          type: "array",
        });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: SMPData[] = XLSX.utils
          .sheet_to_json<SMPData>(worksheet)
          .map((row: any) => ({
            기간: row["기간"],
            LNG: Number(row["LNG"]),
            유류: Number(row["유류"]),
            무연탄: Number(row["무연탄"]),
            유연탄: Number(row["유연탄"]),
            원자력: Number(row["원자력"]),
            총계: Number(row["총계"]),
          }));
        setData(jsonData);
        setFilteredData(jsonData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, []);

  // 데이터 필터링 및 KPI 계산
  useEffect(() => {
    let filtered = data;

    if (selectedYear !== "전체") {
      filtered = filtered.filter((item) => item.기간.startsWith(selectedYear));
    }

    setFilteredData(filtered);

    // KPI 계산
    const totalKPI = {
      LNG: filtered.reduce((sum, item) => sum + item.LNG, 0),
      유류: filtered.reduce((sum, item) => sum + item.유류, 0),
      무연탄: filtered.reduce((sum, item) => sum + item.무연탄, 0),
      유연탄: filtered.reduce((sum, item) => sum + item.유연탄, 0),
      원자력: filtered.reduce((sum, item) => sum + item.원자력, 0),
      총계: filtered.reduce((sum, item) => sum + item.총계, 0),
    };

    setKpi(totalKPI);
  }, [selectedYear, data]);

  // 데이터 다운로드
  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SMP Data");
    XLSX.writeFile(workbook, "SMP_Data.xlsx");
  };

  // 도넛 차트 데이터
  const doughnutData = Object.keys(kpi)
    .filter((key) => key !== "총계") // 총계 제외
    .map((key) => ({
      name: key,
      value: kpi[key as keyof typeof kpi],
    }));

  const colors = ["#34D399", "#60A5FA", "#F87171", "#93C5FD", "#FBBF24"];

  // 라인 차트 데이터
  const lineChartData = {
    labels: filteredData.map((item) => item.기간),
    datasets: [
      {
        label: selectedFuel === "전체" ? "총계" : selectedFuel,
        data: filteredData.map((item) =>
          selectedFuel === "전체"
            ? item.총계
            : Number(item[selectedFuel as keyof SMPData] || 0),
        ),
        borderColor: "#34D399",
        backgroundColor: "rgba(52, 211, 153, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white md:p-8">
      <h1 className="mb-6 text-center text-4xl font-bold">
        계통한계가격(SMP) 대시보드
      </h1>

      {/* 필터와 다운로드 */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <label className="text-sm text-gray-300">기간 선택:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="ml-2 rounded-md bg-gray-800 p-2 text-white"
          >
            <option value="전체">전체</option>
            {[...new Set(data.map((item) => item.기간.split("/")[0]))].map(
              (year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ),
            )}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-300">연료원 선택:</label>
          <select
            value={selectedFuel}
            onChange={(e) => setSelectedFuel(e.target.value)}
            className="ml-2 rounded-md bg-gray-800 p-2 text-white"
          >
            <option value="전체">전체</option>
            {["LNG", "유류", "무연탄", "유연탄", "원자력"].map((fuel) => (
              <option key={fuel} value={fuel}>
                {fuel}
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
        {Object.keys(kpi).map((key) => (
          <KPICard
            key={key}
            title={key}
            value={kpi[key as keyof typeof kpi].toLocaleString()}
            unit="MWh"
            backgroundColor="#3B82F6"
            iconColor="#1D4ED8"
          />
        ))}
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-gray-800 p-4">
          <h2 className="text-lg font-semibold">연료원별 비율</h2>
          <DoughnutChart data={doughnutData} colors={colors} />
        </div>
        <div className="rounded-lg bg-gray-800 p-4">
          <h2 className="text-lg font-semibold">기간별 SMP 추이</h2>
          <LineChart data={lineChartData} />
        </div>
      </div>

      {/* Table */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">세부 데이터</h2>
        <Table data={filteredData} />
      </div>
    </div>
  );
};

export default SMPDashboard;
