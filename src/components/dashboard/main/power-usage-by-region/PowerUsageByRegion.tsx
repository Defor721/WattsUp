"use client";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";
import * as XLSX from "xlsx";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Label,
  Button,
  Card,
} from "@/components/shadcn";
import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

import KPICard from "./KPICard";
import Container from "../Container";
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import Table from "./Table";

// Register Chart.js elements
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
);

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
  세종: number;
  합계: number;
}

function PowerUsageByRegion() {
  const [data, setData] = useState<CustomerData[]>([]);
  const [filteredData, setFilteredData] = useState<{
    [key: string]: string | number;
  } | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    세종: 0,
  });

  const COLORS = [
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
  ];

  // Data loading function
  const fetchData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching data...");

      const response = await fetch(
        "/assets/dashboards/HOME_Generation_Sales_Number_of_customers_By_city_and_province.xlsx.xlsx",
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // console.log("Response received:", response);
      const arrayBuffer = await response.arrayBuffer();
      // console.log("Array buffer received");

      const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
        type: "array",
      });
      // console.log("Workbook loaded:", workbook.SheetNames);

      if (workbook.SheetNames.length === 0) {
        throw new Error("Excel file contains no sheets");
      }

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: CustomerData[] = XLSX.utils
        .sheet_to_json(worksheet)
        .map((row: any) => {
          // console.log("Processing row:", row);
          const processedRow = {
            연도: Number(row["연도"]),
            서울: Number(row["서울"] || 0),
            부산: Number(row["부산"] || 0),
            대구: Number(row["대구"] || 0),
            인천: Number(row["인천"] || 0),
            광주: Number(row["광주"] || 0),
            대전: Number(row["대전"] || 0),
            울산: Number(row["울산"] || 0),
            경기: Number(row["경기"] || 0),
            강원: Number(row["강원"] || 0),
            충북: Number(row["충북"] || 0),
            충남: Number(row["충남"] || 0),
            전북: Number(row["전북"] || 0),
            전남: Number(row["전남"] || 0),
            경북: Number(row["경북"] || 0),
            경남: Number(row["경남"] || 0),
            세종: Number(row["세종"] || 0),
            합계: Number(row["합계"] || 0),
          };

          // Validate the processed row
          if (isNaN(processedRow.연도) || processedRow.연도 === 0) {
            console.warn("Invalid year found in row:", row);
            return null;
          }

          return processedRow;
        })
        .filter((row): row is CustomerData => row !== null); // Filter out invalid rows

      // console.log("Processed data:", jsonData);

      if (jsonData.length === 0) {
        throw new Error("No valid data found in Excel file");
      }

      setData(jsonData);
      setSelectedYear(jsonData[0]?.연도);
    } catch (error) {
      console.error("Error loading data:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
      setData([]);
      setSelectedYear(2023);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchData();
  }, []);

  // Filter data when year changes
  useEffect(() => {
    if (selectedYear) {
      const selectedData = data.find((item) => item.연도 === selectedYear);
      if (selectedData) {
        setFilteredData(
          Object.entries(selectedData).reduce(
            (acc, [key, value]) => ({ ...acc, [key]: value }),
            {},
          ),
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { 연도, 합계, ...regionData } = selectedData;
        setKpi(regionData);
      } else {
        setFilteredData(null);
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
          세종: 0,
        });
      }
    }
  }, [selectedYear, data]);

  // Chart data preparation
  const doughnutData = Object.entries(kpi).map(([key, value]) => ({
    name: key,
    value: Number(value),
  }));

  const lineChartData = data
    .sort((a, b) => a.연도 - b.연도)
    .map((item) => ({
      year: item.연도,
      total: item.합계,
    }));

  if (isLoading) {
    return <div className="text-2xl">데이터를 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <div className="rounded-lg bg-red-600 p-4 text-white">
          <h2 className="text-xl font-bold">오류 발생</h2>
          <p>{error}</p>
          <button
            onClick={() => fetchData()}
            className="mt-4 rounded bg-white px-4 py-2 text-red-600 hover:bg-gray-100"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <Container>
      {/* Year Selection */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        {/* 연료원 선택 */}
        <div className="flex items-center justify-end gap-3">
          <Label
            htmlFor="year"
            className="text-mainColor dark:text-white md:text-base"
          >
            연도 선택
          </Label>
          <Select
            value={selectedYear?.toString()}
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger id="year" className="w-[180px]">
              <SelectValue placeholder="연도 선택" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-subColor">
              {data
                .sort((a, b) => b.연도 - a.연도)
                .map((item) => (
                  <SelectItem
                    className="z-10 bg-white dark:bg-subColor"
                    key={item.연도}
                    value={item.연도.toString()}
                  >
                    {item.연도}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* 데이터 새로고침 버튼 */}
        <Button
          onClick={() => fetchData()}
          className="bg-subColor text-white dark:bg-white dark:text-subColor"
        >
          데이터 새로고침
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Object.entries(kpi).map(([key, value]) => (
          <KPICard
            key={key}
            title={key}
            value={value.toLocaleString()}
            unit="명"
            backgroundColor="#3B82F6"
            iconColor="#1D4ED8"
          />
        ))}
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="flex-1 p-6 shadow-lg">
          <h2 className="mb-4 text-center text-lg font-semibold">
            지역별 비율
          </h2>
          <div className="flex items-center justify-center">
            <div className="w-[450px]">
              <PieChart data={doughnutData} colors={COLORS} />
            </div>
            <div className="flex flex-col gap-2">
              {doughnutData
                .sort((a, b) => b.value - a.value)
                .map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200"
                  >
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span>
                      {item.name}: {formatNumberWithoutDecimal(item.value)} 명
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </Card>
        <Card className="flex-1 p-6 shadow-lg">
          <h2 className="mb-4 text-center text-lg font-semibold">
            연도별 지역 합계 추이
          </h2>
          <LineChart data={lineChartData} />
        </Card>
      </div>

      {/* Table */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">세부 데이터(단위: 명)</h2>
        <Table data={data.map((item) => ({ ...item }))} />
      </div>
    </Container>
  );
}

export default PowerUsageByRegion;
