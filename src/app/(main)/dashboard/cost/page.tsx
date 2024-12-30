"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

import LineChart from "@/components/dashboard/page11/LineChart";
import BarChart from "@/components/dashboard/page11/BarChart";
import KPICard from "@/components/dashboard/page11/KPICard";
import RecentOrders from "@/components/dashboard/page11/RecentOrders";
import UsersByCountry from "@/components/dashboard/page11/UsersByCountry";

interface DataRow {
  기간: string;
  연료단가_원자력: number;
  연료단가_유연탄: number;
  연료단가_무연탄: number;
  연료단가_유류: number;
  연료단가_LNG: number;
  열량단가_원자력: number;
  열량단가_유연탄: number;
  열량단가_무연탄: number;
  열량단가_유류: number;
  연료비단가_원자력: number;
  연료비단가_유연탄: number;
  연료비단가_무연탄: number;
  연료비단가_유류: number;
  연료비단가_LNG: number;
}

const FuelCostDashboard = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("2024/12");
  const [currentKPI, setCurrentKPI] = useState<DataRow | null>(null);

  // 데이터 불러오기
  useEffect(() => {
    const loadData = async () => {
      const response = await fetch(
        "/assets/dashboards/HOME_Power Transaction_Fuel Cost.xlsx",
      );
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
        type: "array",
      });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: DataRow[] = XLSX.utils
        .sheet_to_json(worksheet)
        .map((row: any) => ({
          기간: row["기간"],
          연료단가_원자력: Number(row["연료단가_원자력(원/kwh)"]),
          연료단가_유연탄: Number(row["연료단가_유연탄(원/ton)"]),
          연료단가_무연탄: Number(row["연료단가_무연탄(원/ton)"]),
          연료단가_유류: Number(row["연료단가_유류(원/kl)"]),
          연료단가_LNG: Number(row["연료단가_LNG(원/ton)"]),
          열량단가_원자력: Number(row["열량단가_원자력(원/Gcal)"]),
          열량단가_유연탄: Number(row["열량단가_유연탄(원/Gcal)"]),
          열량단가_무연탄: Number(row["열량단가_무연탄(원/Gcal)"]),
          열량단가_유류: Number(row["열량단가_유류(원/Gcal)"]),
          연료비단가_원자력: Number(row["연료비단가_원자력(원/kWh)"]),
          연료비단가_유연탄: Number(row["연료비단가_유연탄(원/kWh)"]),
          연료비단가_무연탄: Number(row["연료비단가_무연탄(원/kWh)"]),
          연료비단가_유류: Number(row["연료비단가_유류(원/kWh)"]),
          연료비단가_LNG: Number(row["연료비단가_LNG(원/kWh)"]),
        }));
      setData(jsonData);
      setSelectedPeriod(jsonData[0]?.기간 || "2024/12"); // 최신 기간으로 초기화
      setCurrentKPI(jsonData[0]);
    };

    loadData();
  }, []);

  // 선택한 기간의 KPI 데이터 업데이트
  useEffect(() => {
    const periodData = data.find((row) => row.기간 === selectedPeriod);
    setCurrentKPI(periodData || null);
  }, [selectedPeriod, data]);

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fuel Cost Data");
    XLSX.writeFile(workbook, "FuelCostDashboardData.xlsx");
  };

  const kpiConfig = {
    연료단가_원자력: {
      icon: <TrendingUp size={24} />,
      backgroundColor: "#34D399",
      unit: "원/kWh",
    },
    연료단가_유연탄: {
      icon: <TrendingDown size={24} />,
      backgroundColor: "#60A5FA",
      unit: "원/ton",
    },
    연료단가_LNG: {
      icon: <Activity size={24} />,
      backgroundColor: "#FBBF24",
      unit: "원/ton",
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <h1 className="mb-6 text-center text-4xl font-bold">
        연료 단가 대시보드
      </h1>

      {/* 기간 선택 및 다운로드 */}
      <div className="mb-6 flex items-center justify-between">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="rounded-md border border-gray-300 bg-gray-800 p-2 text-white"
        >
          {data.map((row) => (
            <option key={row.기간} value={row.기간}>
              {row.기간}
            </option>
          ))}
        </select>
        <button
          onClick={handleDownload}
          className="rounded-md bg-blue-600 px-4 py-2 hover:bg-blue-700"
        >
          데이터 다운로드
        </button>
      </div>

      {/* KPI 카드 */}
      {currentKPI && (
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Object.entries(currentKPI).map(([key, value]) => {
            if (key === "기간") return null;
            const config = kpiConfig[key as keyof typeof kpiConfig];
            return (
              config && (
                <KPICard
                  key={key}
                  title={key}
                  value={`${value.toLocaleString()} ${config.unit}`}
                  icon={config.icon}
                  backgroundColor={config.backgroundColor}
                  iconColor="#1E3A8A"
                />
              )
            );
          })}
        </div>
      )}

      {/* 차트 섹션 */}
      <div className="space-y-6">
        <BarChart
          data={{
            labels: data.map((row) => row.기간),
            datasets: [
              {
                label: "연료단가_원자력",
                data: data.map((row) => row.연료단가_원자력),
                backgroundColor: "#4ADE80",
              },
            ],
          }}
          title="원자력 연료 단가 추이"
        />
        <LineChart
          data={{
            labels: data.map((row) => row.기간),
            datasets: [
              {
                label: "연료단가_LNG",
                data: data.map((row) => row.연료단가_LNG),
                borderColor: "#60A5FA",
                backgroundColor: "rgba(96, 165, 250, 0.2)",
                fill: true,
              },
            ],
          }}
          title="LNG 연료 단가 추이"
        />
      </div>

      {/* 최근 데이터 및 국가별 사용자 */}
      <div className="mt-6 space-y-6">
        <RecentOrders
          data={data.map((row) => ({
            기간: row.기간,
            연료단가_원자력: row.연료단가_원자력,
            상태: row.연료단가_원자력 > 5 ? "상승" : "하락",
          }))}
        />
        <UsersByCountry
          data={data.map((row) => ({
            기간: row.기간,
            연료단가_원자력: row.연료단가_원자력,
          }))}
        />
      </div>
    </div>
  );
};

export default FuelCostDashboard;
