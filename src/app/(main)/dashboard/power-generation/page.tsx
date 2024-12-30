"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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

// KPI 카드 컴포넌트
const KPICard = ({
  title,
  value,
  backgroundColor,
}: {
  title: string;
  value: string;
  backgroundColor: string;
}) => (
  <div className="rounded-lg p-6 shadow-lg" style={{ backgroundColor }}>
    <h3 className="mb-2 text-lg font-semibold">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

// 최근 데이터 테이블 컴포넌트
const RecentDataTable = ({ data }: { data: DataRow[] }) => (
  <div className="overflow-x-auto rounded-lg bg-gray-800 p-4">
    <h2 className="mb-4 text-xl font-bold">최근 발전 데이터</h2>
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-700">
          <th className="p-2 text-left">연도</th>
          <th className="p-2 text-left">총발전량</th>
          <th className="p-2 text-left">수력발전</th>
          <th className="p-2 text-left">원자력</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.연도} className="border-b border-gray-700">
            <td className="p-2">{row.연도}</td>
            <td className="p-2">{row.총발전량.toLocaleString()}</td>
            <td className="p-2">{row.수력소계.toLocaleString()}</td>
            <td className="p-2">{row.원자력.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// 발전원별 차트 컴포넌트
const GenerationTypeChart = ({ data }: { data: DataRow[] }) => (
  <div className="h-[400px] w-full rounded-lg bg-gray-800 p-4">
    <h2 className="mb-4 text-xl font-bold">발전원별 발전량</h2>
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="연도" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="수력소계" fill="#4ADE80" />
        <Bar dataKey="원자력" fill="#60A5FA" />
        <Bar dataKey="신재생" fill="#FBBF24" />
      </RechartsBarChart>
    </ResponsiveContainer>
  </div>
);

// 총발전량 추이 차트 컴포넌트
const TotalGenerationChart = ({ data }: { data: DataRow[] }) => (
  <div className="h-[400px] w-full rounded-lg bg-gray-800 p-4">
    <h2 className="mb-4 text-xl font-bold">총발전량 추이</h2>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="연도" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="총발전량"
          stroke="#4ADE80"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// 메인 대시보드 컴포넌트
const GenerationDashboard = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "/assets/dashboards/HOME_generationQuantity.xlsx",
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
          type: "array",
        });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          throw new Error("데이터를 찾을 수 없습니다");
        }

        const formattedData: DataRow[] = jsonData.map((row: any) => ({
          연도: Number(row["연도"]),
          일반수력: Number(row["일반수력"] || 0),
          양수: Number(row["양수"] || 0),
          소수력: Number(row["소수력"] || 0),
          수력소계: Number(row["수력소계"] || 0),
          무연탄: Number(row["무연탄"] || 0),
          유연탄: Number(row["유연탄"] || 0),
          중유: Number(row["중유"] || 0),
          가스: Number(row["가스"] || 0),
          기력소계: Number(row["기력소계"] || 0),
          복합화력일반: Number(row["복합화력일반"] || 0),
          복합화력열공급: Number(row["복합화력열공급"] || 0),
          복합화력총계: Number(row["복합화력총계"] || 0),
          원자력: Number(row["원자력"] || 0),
          신재생: Number(row["신재생"] || 0),
          집단: Number(row["집단"] || 0),
          내연력: Number(row["내연력"] || 0),
          기타: Number(row["기타"] || 0),
          총계: Number(row["총계"] || 0),
          총발전량: Number(row["총발전량"] || 0),
        }));

        setData(formattedData);
        setSelectedYear(formattedData[0]?.연도 || 2023);
        setError(null);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        setError(
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const currentYearData = data.find((row) => row.연도 === selectedYear);

  const kpiConfig = {
    총발전량: { color: "#4ADE80", unit: "MWh" },
    수력소계: { color: "#60A5FA", unit: "MWh" },
    원자력: { color: "#FBBF24", unit: "MWh" },
    신재생: { color: "#F87171", unit: "MWh" },
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 p-6 text-white">
        <div className="text-center text-red-500">
          <h2 className="mb-4 text-2xl font-bold">오류 발생</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 p-6 text-white">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">데이터 로딩 중...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <h1 className="mb-6 text-center text-4xl font-bold">발전량 대시보드</h1>

      {/* 연도 선택 */}
      <div className="mb-6 flex items-center justify-center">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="rounded-md border border-gray-300 bg-gray-800 p-2 text-white"
        >
          {data.map((row) => (
            <option key={row.연도} value={row.연도}>
              {row.연도}년
            </option>
          ))}
        </select>
      </div>

      {/* KPI 카드 그리드 */}
      {currentYearData && (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(kpiConfig).map(([key, config]) => (
            <KPICard
              key={key}
              title={key}
              value={`${currentYearData[key as keyof DataRow].toLocaleString()} ${config.unit}`}
              backgroundColor={config.color}
            />
          ))}
        </div>
      )}

      {/* 차트 섹션 */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TotalGenerationChart data={data} />
        <GenerationTypeChart data={data} />
      </div>

      {/* 최근 데이터 테이블 */}
      <RecentDataTable data={data.slice(-5)} />
    </div>
  );
};

export default GenerationDashboard;
