"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

import BarChart from "@/components/dashboard/page12/BarChart";
import LineChart from "@/components/dashboard/page12/LineChart";
import KPICard from "@/components/dashboard/page12/KPICard";

interface DataRow {
  연도: number;
  발전설비_건: number;
  송전설비_건: number;
  변전설비_건: number;
  배전설비_건: number;
  총계_건: number;
}

const EquipmentDashboard = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [currentKPI, setCurrentKPI] = useState<DataRow | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch(
        "/assets/dashboards/HOME_Electrical equipment_Trend of electrical failures by type.xlsx",
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
          발전설비_건: Number(row["발전설비(건)"]),
          송전설비_건: Number(row["송전설비(건)"]),
          변전설비_건: Number(row["변전설비(건)"]),
          배전설비_건: Number(row["배전설비(건)"]),
          총계_건: Number(row["총계(건)"]),
        }));
      setData(jsonData);
      setSelectedYear(jsonData[0]?.연도 || null);
      setCurrentKPI(jsonData[0]);
    };

    loadData();
  }, []);

  useEffect(() => {
    const yearData = data.find((row) => row.연도 === selectedYear);
    setCurrentKPI(yearData || null);
  }, [selectedYear, data]);

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <h1 className="mb-6 text-center text-4xl font-bold">
        전기 설비 고장 대시보드
      </h1>

      {/* 연도 선택 */}
      <div className="mb-6 flex justify-between">
        <select
          value={selectedYear || ""}
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
          <KPICard
            title="발전설비"
            value={`${currentKPI.발전설비_건} 건`}
            backgroundColor="#34D399"
          />
          <KPICard
            title="송전설비"
            value={`${currentKPI.송전설비_건} 건`}
            backgroundColor="#60A5FA"
          />
          <KPICard
            title="변전설비"
            value={`${currentKPI.변전설비_건} 건`}
            backgroundColor="#FBBF24"
          />
          <KPICard
            title="총계"
            value={`${currentKPI.총계_건} 건`}
            backgroundColor="#EF4444"
          />
        </div>
      )}

      {/* 차트 */}
      <div className="space-y-6">
        <BarChart
          data={{
            labels: data.map((row) => row.연도),
            datasets: [
              {
                label: "발전설비",
                data: data.map((row) => row.발전설비_건),
                backgroundColor: "#34D399",
              },
              {
                label: "송전설비",
                data: data.map((row) => row.송전설비_건),
                backgroundColor: "#60A5FA",
              },
              {
                label: "변전설비",
                data: data.map((row) => row.변전설비_건),
                backgroundColor: "#FBBF24",
              },
              {
                label: "배전설비",
                data: data.map((row) => row.배전설비_건),
                backgroundColor: "#EF4444",
              },
            ],
          }}
          title="연도별 설비 고장 건수 비교"
        />
        <LineChart
          data={{
            labels: data.map((row) => row.연도),
            datasets: [
              {
                label: "총계",
                data: data.map((row) => row.총계_건),
                borderColor: "#4ADE80",
                backgroundColor: "rgba(72, 223, 128, 0.2)",
                fill: true,
              },
            ],
          }}
          title="연도별 설비 고장 총계 추이"
        />
      </div>
    </div>
  );
};

export default EquipmentDashboard;
