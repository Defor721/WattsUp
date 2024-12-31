"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  BatteryCharging,
  Activity,
  TrendingUp,
  TrendingDown,
  Download,
} from "lucide-react";

import KPICard from "@/components/dashboard/page/KPIcard";
import LineChart from "@/components/dashboard/page2/LineChart";
import DoughnutChart from "@/components/dashboard/page2/DoughnutChart";
import BarChart from "@/components/dashboard/page2/BarChart";

import Table from "./Table";
import Container from "../Container";

interface EconomicData {
  연도: number;
  생산자물가지수: number;
  소비자물가지수: number;
  경상수지: number;
  자본수지: number;
  외환보유액: number;
  수출액: number;
  수입액: number;
  환율: number;
  실업률: number;
  콜금리: number;
}

function Economic() {
  const [data, setData] = useState<EconomicData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [currentYearData, setCurrentYearData] = useState<EconomicData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizeData = (row: Record<string, any>): EconomicData => ({
    연도: Number(row["연도"]),
    생산자물가지수: Number(row["생산자물가지수(2015=100)"]),
    소비자물가지수: Number(row["소비자물가지수(2020=100)"]),
    경상수지: Number(row["경상수지(백만US$)"]),
    자본수지: Number(row["자본수지(백만US$)"]),
    외환보유액: Number(row["외환보유액(백만US$)"]),
    수출액: Number(row["수출액(백만US$)"]),
    수입액: Number(row["수입액(백만US$)"]),
    환율: Number(row["환율(원/US$)"]),
    실업률: Number(row["실업률(%)"]),
    콜금리: Number(row["콜금리(연%)"]),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "/assets/dashboards/HOME_Main indicators_Economic indicators.xlsx",
        );
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
          type: "array",
        });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: EconomicData[] = XLSX.utils
          .sheet_to_json<Record<string, any>>(worksheet)
          .map(normalizeData);

        setData(jsonData);
        console.log("jsonData: ", jsonData);
        const latestYear = jsonData[0]?.연도 || null;
        setSelectedYear(latestYear);
        setCurrentYearData(
          jsonData.find((item) => item.연도 === latestYear) || null,
        );
        setError(null);
      } catch (error) {
        console.error("Failed to load data:", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      const yearData = data.find((item) => item.연도 === selectedYear);
      setCurrentYearData(yearData || null);
    }
  }, [selectedYear, data]);

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Economic Data");
    XLSX.writeFile(workbook, "EconomicDashboardData.xlsx");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <div>데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <div>{error}</div>
      </div>
    );
  }

  if (!currentYearData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <div>데이터가 없습니다.</div>
      </div>
    );
  }

  return (
    <Container>
      <h1 className="mb-6 text-center text-4xl font-bold text-white">
        경제지표 대시보드
      </h1>

      {/* 연도 선택 및 다운로드 */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-4 md:justify-end">
        <select
          className="rounded-md border border-gray-300 bg-gray-800 p-2 text-white"
          value={selectedYear || ""}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {data.map((item) => (
            <option key={item.연도} value={item.연도}>
              {item.연도}
            </option>
          ))}
        </select>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Download size={16} />
          데이터 다운로드
        </button>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="생산자물가지수"
          value={`${currentYearData.생산자물가지수}`}
          icon={<Activity size={24} color="#FFFFFF" />}
          backgroundColor="#6D28D9"
          iconColor="#A855F7"
        />
        <KPICard
          title="소비자물가지수"
          value={`${currentYearData.소비자물가지수}`}
          icon={<TrendingUp size={24} color="#FFFFFF" />}
          backgroundColor="#22C55E"
          iconColor="#16A34A"
        />
        <KPICard
          title="경상수지"
          value={`${currentYearData.경상수지.toLocaleString()} 백만US$`}
          icon={<TrendingDown size={24} color="#FFFFFF" />}
          backgroundColor="#F59E0B"
          iconColor="#FACC15"
        />
        <KPICard
          title="외환보유액"
          value={`${currentYearData.외환보유액.toLocaleString()} 백만US$`}
          icon={<BatteryCharging size={24} color="#FFFFFF" />}
          backgroundColor="#3B82F6"
          iconColor="#2563EB"
        />
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="w-full rounded-lg bg-gray-800 p-4 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-white">
            연도별 주요 경제지표
          </h2>
          <LineChart
            data={data.map((item) => ({
              연도: item.연도,
              수출액: item.수출액,
              수입액: item.수입액,
              환율: item.환율,
            }))}
          />
        </div>

        <div className="w-full rounded-lg bg-gray-800 p-4 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-white">
            경제 구성 비율
          </h2>
          <DoughnutChart
            data={{
              수출액: currentYearData.수출액,
              수입액: currentYearData.수입액,
              경상수지: currentYearData.경상수지,
            }}
          />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-white">
          연도별 데이터 비교
        </h2>
        <BarChart
          data={data.map((item) => ({
            category: `${item.연도}년`,
            value: item.수출액,
          }))}
          title="연도별 수출액"
          xAxisLabel="연도"
          yAxisLabel="수출액 (백만 US$)"
        />
      </div>

      {/* Table */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">세부 데이터</h2>
        <Table />
      </div>
    </Container>
  );
}

export default Economic;
