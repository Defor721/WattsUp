"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  BatteryCharging,
  Download,
} from "lucide-react";

import KPICard from "@/components/dashboard/page3/KPICard";
import LineChart from "@/components/dashboard/page3/LineChart";
import DoughnutChart from "@/components/dashboard/page3/DoughnutChart";
import DataTable from "@/components/dashboard/page2/DataTable";

interface EnergyData {
  연도: number;
  총에너지: number;
  석탄합계: number;
  석유합계: number;
  LNG: number;
  수력: number;
  원자력: number;
  기타: number;
}

const EnergyDashboard: React.FC = () => {
  const [data, setData] = useState<EnergyData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [currentYearData, setCurrentYearData] = useState<EnergyData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizeData = (row: Record<string, any>): EnergyData => {
    try {
      return {
        연도: Number(row["연도"]),
        총에너지: Number(row["1차에너지소비(1000ton)_총에너지"]),
        석탄합계: Number(row["1차에너지소비(1000ton)_석탄합계"]),
        석유합계: Number(row["1차에너지소비(1000ton)_석유합계"]),
        LNG: Number(row["1차에너지소비(1000ton)_LNG"]),
        수력: Number(row["1차에너지소비(1000ton)_수력"]),
        원자력: Number(row["1차에너지소비(1000ton)_원자력"]),
        기타: Number(row["1차에너지소비(1000ton)_기타"]),
      };
    } catch (err) {
      console.error("Failed to normalize data:", row, err);
      throw new Error("Invalid data format");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "/assets/dashboards/HOME_Main indicators_Energy indicators.xlsx",
        );
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
          type: "array",
        });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: EnergyData[] = XLSX.utils
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

  useEffect(() => {
    if (selectedYear) {
      const yearData = data.find((item) => item.연도 === selectedYear);
      setCurrentYearData(yearData || null);
    }
  }, [selectedYear, data]);

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Energy Data");
    XLSX.writeFile(workbook, "EnergyDashboardData.xlsx");
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
        에너지 지표 대시보드
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
          title="총 에너지 소비량"
          value={`${currentYearData.총에너지.toLocaleString()} 1000ton`}
          icon={<BatteryCharging size={24} color="#FFFFFF" />}
          backgroundColor="#6D28D9"
          iconColor="#A855F7"
        />
        <KPICard
          title="석탄 소비량"
          value={`${currentYearData.석탄합계.toLocaleString()} 1000ton`}
          icon={<TrendingDown size={24} color="#FFFFFF" />}
          backgroundColor="#22C55E"
          iconColor="#16A34A"
        />
        <KPICard
          title="석유 소비량"
          value={`${currentYearData.석유합계.toLocaleString()} 1000ton`}
          icon={<Activity size={24} color="#FFFFFF" />}
          backgroundColor="#F59E0B"
          iconColor="#FACC15"
        />
        <KPICard
          title="LNG 소비량"
          value={`${currentYearData.LNG.toLocaleString()} 1000ton`}
          icon={<TrendingUp size={24} color="#FFFFFF" />}
          backgroundColor="#3B82F6"
          iconColor="#2563EB"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="w-full rounded-lg bg-gray-800 p-4 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-white">
            연도별 에너지 소비량
          </h2>
          <LineChart
            data={[
              {
                category: "총 에너지",
                values: data.map((item) => item.총에너지),
              },
              {
                category: "석탄",
                values: data.map((item) => item.석유합계),
              },
              {
                category: "석유",
                values: data.map((item) => item.석유합계),
              },
            ]}
            title="연도별 에너지 소비량"
          />
        </div>
        <div className="w-full rounded-lg bg-gray-800 p-4 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-white">
            에너지 소비 비율
          </h2>
          <DoughnutChart
            data={{
              석탄: currentYearData.석탄합계,
              석유: currentYearData.석유합계,
              LNG: currentYearData.LNG,
              기타: currentYearData.기타,
            }}
            title="에너지 소비 비율"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-white">데이터 테이블</h2>
        <DataTable
          data={data.map((item) => ({
            연도: item.연도.toString(),
            총에너지: item.총에너지.toLocaleString(),
            석탄합계: item.석탄합계.toLocaleString(),
            석유합계: item.석유합계.toLocaleString(),
            LNG: item.LNG.toLocaleString(),
            수력: item.수력.toLocaleString(),
            원자력: item.원자력.toLocaleString(),
          }))}
          columns={[
            { key: "연도", title: "연도" },
            { key: "총에너지", title: "총 에너지 소비량 (1000ton)" },
            { key: "석탄합계", title: "석탄 소비량 (1000ton)" },
            { key: "석유합계", title: "석유 소비량 (1000ton)" },
            { key: "LNG", title: "LNG 소비량 (1000ton)" },
            { key: "수력", title: "수력 소비량 (1000ton)" },
            { key: "원자력", title: "원자력 소비량 (1000ton)" },
          ]}
        />
      </div>
    </div>
  );
};

export default EnergyDashboard;
