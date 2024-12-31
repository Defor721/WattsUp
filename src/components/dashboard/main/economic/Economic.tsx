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

import {
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Button,
} from "@/components/shadcn";

import Table from "./Table";
import Container from "../Container";
import KPICard from "./KPICard";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import BarChart from "./BarChart";

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
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!currentYearData) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <Container>
      {/* 연도 선택 및 다운로드 */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center justify-end gap-3">
          <Label
            htmlFor="year"
            className="text-mainColor dark:text-white md:text-base"
          >
            연도 선택
          </Label>
          <Select
            value={selectedYear ? String(selectedYear) : ""}
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger id="year" className="w-[180px]">
              <SelectValue placeholder="연도 선택" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-subColor">
              {data.map((item) => (
                <SelectItem
                  className="z-10 bg-white dark:bg-subColor"
                  key={item.연도}
                  value={String(item.연도)}
                >
                  {item.연도}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Download size={16} />
          데이터 다운로드
        </Button>
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
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold">연도별 주요 경제지표</h2>
          <LineChart
            data={[...data]
              .sort((a, b) => a.연도 - b.연도) // 연도를 기준으로 역순 정렬
              .map((item) => ({
                연도: item.연도,
                수출액: item.수출액,
                수입액: item.수입액,
                환율: item.환율,
              }))}
          />
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold">경제 구성 비율</h2>
          <PieChart
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
        <h2 className="text-center text-lg font-semibold">
          연도별 데이터 비교
        </h2>
        <BarChart
          data={[...data]
            .sort((a, b) => a.연도 - b.연도)
            .map((item) => ({
              category: `${item.연도}년`,
              value: item.수출액,
            }))}
        />
      </div>

      {/* Table */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">세부 데이터</h2>
        <Table currentYearData={currentYearData} data={data} />
      </div>
    </Container>
  );
}

export default Economic;
