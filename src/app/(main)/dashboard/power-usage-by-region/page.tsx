"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

import KPICard from "@/components/dashboard/page9/KPICard";
import DoughnutChart from "@/components/dashboard/page9/DoughnutChart";
import LineChart from "@/components/dashboard/page9/LineChart";
import Table from "@/components/dashboard/page9/Table";

interface CustomerData {
  연도: number;
  서울: number;
  부산: number;
  대구: number;
  인천: number;
  광주: number;
  대전: number;
  울산: number;
  경기: number;
  강원: number;
  충북: number;
  충남: number;
  전북: number;
  전남: number;
  경북: number;
  경남: number;
  제주: number;
  세종: number;
  개성: number;
  합계: number;
}

const CustomerDashboard = () => {
  const [data, setData] = useState<CustomerData[]>([]);
  const [filteredData, setFilteredData] = useState<CustomerData | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [kpi, setKpi] = useState<Omit<CustomerData, "연도" | "합계">>({
    서울: 0,
    부산: 0,
    대구: 0,
    인천: 0,
    광주: 0,
    대전: 0,
    울산: 0,
    경기: 0,
    강원: 0,
    충북: 0,
    충남: 0,
    전북: 0,
    전남: 0,
    경북: 0,
    경남: 0,
    제주: 0,
    세종: 0,
    개성: 0,
  });

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/assets/dashboards/customer_data.xlsx");
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
          type: "array",
        });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: CustomerData[] = XLSX.utils
          .sheet_to_json<CustomerData>(worksheet)
          .map((row: any) => ({
            연도: Number(row["연도"]),
            서울: Number(row["서울"]),
            부산: Number(row["부산"]),
            대구: Number(row["대구"]),
            인천: Number(row["인천"]),
            광주: Number(row["광주"]),
            대전: Number(row["대전"]),
            울산: Number(row["울산"]),
            경기: Number(row["경기"]),
            강원: Number(row["강원"]),
            충북: Number(row["충북"]),
            충남: Number(row["충남"]),
            전북: Number(row["전북"]),
            전남: Number(row["전남"]),
            경북: Number(row["경북"]),
            경남: Number(row["경남"]),
            제주: Number(row["제주"]),
            세종: Number(row["세종"]),
            개성: Number(row["개성"]),
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
    if (selectedYear) {
      const selectedData = data.find((item) => item.연도 === selectedYear);
      setFilteredData(selectedData || null);

      if (selectedData) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { 연도, 합계, ...regionData } = selectedData;
        setKpi(regionData);
      } else {
        setKpi({
          서울: 0,
          부산: 0,
          대구: 0,
          인천: 0,
          광주: 0,
          대전: 0,
          울산: 0,
          경기: 0,
          강원: 0,
          충북: 0,
          충남: 0,
          전북: 0,
          전남: 0,
          경북: 0,
          경남: 0,
          제주: 0,
          세종: 0,
          개성: 0,
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
    labels: Object.keys(kpi),
    datasets: [
      {
        data: Object.values(kpi),
        backgroundColor: [
          "#34D399",
          "#60A5FA",
          "#F87171",
          "#93C5FD",
          "#FBBF24",
          "#A78BFA",
          "#FCA5A5",
          "#2DD4BF",
          "#4ADE80",
          "#FB7185",
          "#C084FC",
          "#FACC15",
          "#F97316",
          "#10B981",
          "#6366F1",
          "#EAB308",
          "#8B5CF6",
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

  // 데이터 변환 (Table용)
  const convertToTableData = (
    data: CustomerData,
  ): { [key: string]: string | number } => {
    return Object.entries(data).reduce<{ [key: string]: string | number }>(
      (acc, [key, value]) => {
        acc[key] = value;
        return acc;
      },
      {},
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white md:p-8">
      <h1 className="mb-6 text-center text-4xl font-bold">
        전력발전량_시도별 대시보드
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
          <h2 className="text-lg font-semibold">지역별 비율</h2>
          <DoughnutChart data={doughnutData} />
        </div>
        <div className="rounded-lg bg-gray-800 p-4">
          <h2 className="text-lg font-semibold">연도별 지역 합계 추이</h2>
          <LineChart data={lineChartData} />
        </div>
      </div>

      {/* Table */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">세부 데이터</h2>
        <Table data={filteredData ? [convertToTableData(filteredData)] : []} />
      </div>
    </div>
  );
};

export default CustomerDashboard;
