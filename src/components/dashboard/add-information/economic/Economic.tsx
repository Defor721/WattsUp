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
  Card,
} from "@/components/shadcn";
import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";
import Loading from "@/app/loading";

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
    return <Loading />;
  }

  if (!currentYearData) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <Container>
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
            <SelectContent className="bg-white dark:bg-gray-800">
              {data.map((item) => (
                <SelectItem
                  className="z-10 bg-white dark:bg-gray-800"
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
          className="bg-subColor text-white dark:bg-white dark:text-subColor"
        >
          <Download size={16} />
          데이터 다운로드
        </Button>
      </div>

      <div className="flex flex-col gap-cardGap">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
          <KPICard
            title="생산자물가지수"
            value={`${currentYearData.생산자물가지수}`}
            backgroundColor="#34D399"
          />
          <KPICard
            title="소비자물가지수"
            value={`${currentYearData.소비자물가지수}`}
            backgroundColor="#60A5FA"
          />
          <KPICard
            title="경상수지"
            value={`${currentYearData.경상수지.toLocaleString()} `}
            unit={"백만US$"}
            backgroundColor="#F87171"
          />
          <KPICard
            title="외환보유액"
            value={`${currentYearData.외환보유액.toLocaleString()} `}
            unit={"백만US$"}
            backgroundColor="#FBBF24"
          />
        </div>

        <div className="grid grid-cols-1 gap-cardGap xl:grid-cols-2">
          <Card className="flex flex-1 flex-col items-center gap-2 border-none bg-cardBackground-light p-cardPadding dark:bg-cardBackground-dark">
            <h2 className="text-lg font-semibold">연도별 주요 경제지표</h2>
            <LineChart
              data={[...data]
                .sort((a, b) => a.연도 - b.연도)
                .map((item) => ({
                  연도: item.연도,
                  수출액: item.수출액,
                  수입액: item.수입액,
                  환율: item.환율,
                }))}
            />
          </Card>
          <Card className="flex flex-col items-center border-none bg-cardBackground-light py-cardPadding pr-cardPadding dark:bg-cardBackground-dark">
            <h2 className="px-cardPadding text-center text-lg font-semibold">
              경제 구성 비율
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="w-[400px]">
                <PieChart
                  data={{
                    수출액: currentYearData.수출액,
                    수입액: currentYearData.수입액,
                    경상수지: currentYearData.경상수지,
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                {[
                  {
                    name: "수출액",
                    value: currentYearData.수출액,
                    color: "#3B82F6",
                  },
                  {
                    name: "수입액",
                    value: currentYearData.수입액,
                    color: "#F59E0B",
                  },
                  {
                    name: "경상수지",
                    value: currentYearData.경상수지,
                    color: "#EF4444",
                  },
                ]
                  .sort((a, b) => b.value - a.value)
                  .map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200"
                    >
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span>
                        {item.name}: {formatNumberWithoutDecimal(item.value)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        </div>

        <Card className="flex flex-col gap-2 border-none bg-cardBackground-light p-cardPadding dark:bg-cardBackground-dark">
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
        </Card>
      </div>

      {/* <Card className="mt-4 border-none bg-cardBackground-light p-cardPadding dark:bg-cardBackground-dark">
        <h2 className="mb-4 text-lg font-semibold">
          최근 10년간 경제지표 데이터
        </h2>
        <Table currentYearData={currentYearData} data={data.slice(0, 10)} />
      </Card> */}
    </Container>
  );
}

export default Economic;
