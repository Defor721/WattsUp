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
import AverageCost from "@/components/dashboard/page/AverageCost";
import PowerList from "@/components/dashboard/page/PowerList";
import LineChart from "@/components/dashboard/page/LineChart";
import DoughnutChart from "@/components/dashboard/page/DoughnutChart";
import FulfillmentChart from "@/components/dashboard/page/FullfillmentChart";

interface PowerData {
  연도: number;
  "발전설비총계(MW)": number;
  "총발전량총계(GWh)": number;
  "부하율(%)": number;
  "이용율(%)": number;
  "평균판매단가(원/kWh)": number;
  "수력(GWh)": number;
  "화력(GWh)": number;
  "원자력(GWh)": number;
  "자가용(GWh)": number;
}

const PowerDashboard: React.FC = () => {
  const [data, setData] = useState<PowerData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [currentYearData, setCurrentYearData] = useState<PowerData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 데이터 정규화 함수
  const normalizeData = (row: Record<string, any>): PowerData => {
    try {
      return {
        연도: Number(row["연도"]),
        "발전설비총계(MW)": Number(row["발전설비총계(MW)"]),
        "총발전량총계(GWh)": Number(row["총발전량총계(GWh)"]),
        "부하율(%)": Number(row["부하율(%)"]),
        "이용율(%)": Number(row["이용율(%)"]),
        "평균판매단가(원/kWh)": Number(row["평균판매단가(원/kWh)"]),
        "수력(GWh)": Number(row["수력(GWh)"]),
        "화력(GWh)": Number(row["화력(GWh)"]),
        "원자력(GWh)": Number(row["원자력(GWh)"]),
        "자가용(GWh)": Number(row["자가용(GWh)"]),
      };
    } catch (err) {
      console.error("Failed to normalize data:", row, err);
      throw new Error("Invalid data format");
    }
  };

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "/assets/dashboards/HOME_Main indicators_Power indicators.xlsx",
        );
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
          type: "array",
        });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const jsonData: PowerData[] = XLSX.utils
          .sheet_to_json<Record<string, any>>(worksheet)
          .map(normalizeData);

        setData(jsonData);

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

  // 선택된 연도에 따른 데이터 설정
  useEffect(() => {
    if (selectedYear) {
      const yearData = data.find((item) => item.연도 === selectedYear);
      setCurrentYearData(yearData || null);
    }
  }, [selectedYear, data]);

  // 다운로드 함수
  const handleDownload = () => {
    if (!data.length) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Power Data");
    XLSX.writeFile(workbook, "PowerDashboardData.xlsx");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <div>Loading...</div>
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
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <h1 className="mb-6 text-center text-4xl font-bold text-white">
        전력지표 대시보드
      </h1>

      {/* 연도 선택 및 다운로드 */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-4 md:justify-end">
        <select
          className="rounded-md border border-gray-300 bg-gray-800 p-2 text-white"
          value={selectedYear || ""}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          <option value="" disabled>
            연도를 선택하세요
          </option>
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
          title="발전설비총계"
          value={`${currentYearData["발전설비총계(MW)"].toLocaleString()} MW`}
          icon={<BatteryCharging size={24} color="#FFFFFF" />}
          backgroundColor="#6D28D9"
          iconColor="#A855F7"
        />
        <KPICard
          title="총발전량"
          value={`${currentYearData["총발전량총계(GWh)"].toLocaleString()} GWh`}
          icon={<Activity size={24} color="#FFFFFF" />}
          backgroundColor="#22C55E"
          iconColor="#16A34A"
        />
        <KPICard
          title="부하율"
          value={`${currentYearData["부하율(%)"]}%`}
          icon={<TrendingUp size={24} color="#FFFFFF" />}
          backgroundColor="#F59E0B"
          iconColor="#FACC15"
        />
        <KPICard
          title="이용율"
          value={`${currentYearData["이용율(%)"]}%`}
          icon={<TrendingDown size={24} color="#FFFFFF" />}
          backgroundColor="#3B82F6"
          iconColor="#2563EB"
        />
      </div>

      {/* Average Cost and PowerList */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AverageCost
          value={currentYearData["평균판매단가(원/kWh)"]}
          maxValue={200}
        />
        <PowerList data={currentYearData} />
      </div>

      {/* 차트 섹션 */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="w-full rounded-lg bg-gray-800 p-4 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-white">
            연도별 발전량 추이
          </h2>
          <LineChart
            data={data.map((item) => ({
              연도: item.연도,
              수력: item["수력(GWh)"],
              화력: item["화력(GWh)"],
              원자력: item["원자력(GWh)"],
              자가용: item["자가용(GWh)"],
            }))}
          />
        </div>

        <div className="w-full rounded-lg bg-gray-800 p-4 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-white">
            총발전량 비율
          </h2>
          <DoughnutChart
            data={{
              수력: currentYearData["수력(GWh)"],
              화력: currentYearData["화력(GWh)"],
              원자력: currentYearData["원자력(GWh)"],
              자가용: currentYearData["자가용(GWh)"],
            }}
          />
        </div>

        <div className="col-span-2 w-full rounded-lg bg-gray-800 p-4 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-white">
            연도별 전력 발전량 비교
          </h2>
          <FulfillmentChart
            previousYearData={[
              { name: "수력", value: data[1]?.["수력(GWh)"] || 0 },
              { name: "화력", value: data[1]?.["화력(GWh)"] || 0 },
              { name: "원자력", value: data[1]?.["원자력(GWh)"] || 0 },
              { name: "자가용", value: data[1]?.["자가용(GWh)"] || 0 },
            ]}
            currentYearData={[
              { name: "수력", value: currentYearData["수력(GWh)"] },
              { name: "화력", value: currentYearData["화력(GWh)"] },
              { name: "원자력", value: currentYearData["원자력(GWh)"] },
              { name: "자가용", value: currentYearData["자가용(GWh)"] },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default PowerDashboard;
