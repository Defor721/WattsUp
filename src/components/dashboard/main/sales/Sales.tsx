"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";

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

import KPICard from "./KPICard";
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import Table from "./Table";
import Container from "../Container";

interface DataRow {
  연도: number;
  주택용: number;
  일반용: number;
  교육용: number;
  산업용: number;
  농사용: number;
  가로등: number;
  심야: number;
  합계: number;
}
function Sales() {
  const [data, setData] = useState<DataRow[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [currentYearData, setCurrentYearData] = useState<DataRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "/assets/dashboards/HOME_sales_Amount.xlsx",
        );
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
          type: "array",
        });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: DataRow[] = XLSX.utils
          .sheet_to_json<Record<string, any>>(worksheet)
          .map((row: any) => ({
            연도: Number(row["연도"]) || 0,
            주택용: Number(row["주택용"]) || 0,
            일반용: Number(row["일반용"]) || 0,
            교육용: Number(row["교육용"]) || 0,
            산업용: Number(row["산업용"]) || 0,
            농사용: Number(row["농사용"]) || 0,
            가로등: Number(row["가로등"]) || 0,
            심야: Number(row["심야"]) || 0,
            합계: Number(row["합계"]) || 0,
          }));
        setData(jsonData);
        setSelectedYear(jsonData[0]?.연도 || null); // 첫 번째 연도를 초기값으로 설정
        setError(null);
      } catch (err) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedYear && data.length > 0) {
      const yearData = data.find((row) => row.연도 === selectedYear);
      setCurrentYearData(
        yearData || {
          연도: selectedYear,
          주택용: 0,
          일반용: 0,
          교육용: 0,
          산업용: 0,
          농사용: 0,
          가로등: 0,
          심야: 0,
          합계: 0,
        },
      );
    }
  }, [selectedYear, data]);

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SalesPriceData");
    XLSX.writeFile(workbook, "SalesPriceData.xlsx");
  };

  const kpiData = currentYearData
    ? [
        { title: "주택용", value: currentYearData.주택용, unit: "원" },
        { title: "산업용", value: currentYearData.산업용, unit: "원" },
        { title: "합계", value: currentYearData.합계, unit: "원" },
      ]
    : [
        { title: "주택용", value: 0, unit: "원" },
        { title: "산업용", value: 0, unit: "원" },
        { title: "합계", value: 0, unit: "원" },
      ];

  const pieChartData = currentYearData
    ? {
        labels: [
          "주택용",
          "일반용",
          "교육용",
          "산업용",
          "농사용",
          "가로등",
          "심야",
        ],
        datasets: [
          {
            data: [
              currentYearData.주택용,
              currentYearData.일반용,
              currentYearData.교육용,
              currentYearData.산업용,
              currentYearData.농사용,
              currentYearData.가로등,
              currentYearData.심야,
            ],
            backgroundColor: [
              "#34D399",
              "#60A5FA",
              "#F87171",
              "#93C5FD",
              "#FBBF24",
              "#A78BFA",
              "#FCA5A5",
            ],
          },
        ],
      }
    : null;

  const lineChartData = data
    .sort((a, b) => a.연도 - b.연도)
    .map((row) => ({
      year: row.연도, // X축에 표시할 연도
      합계: row.합계, // 천만 단위로 변환 (필요하면 조정)
    }));

  if (isLoading) {
    return <div>데이터 로드 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
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
            value={selectedYear?.toString() || ""}
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger id="year" className="w-[180px]">
              <SelectValue placeholder="연도 선택" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-subColor">
              {data
                .sort((a, b) => b.연도 - a.연도)
                .map((row) => (
                  <SelectItem
                    className="z-10 bg-white dark:bg-subColor"
                    key={row.연도}
                    value={row.연도.toString()}
                  >
                    {row.연도}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <Download size={16} />
          데이터 다운로드
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {kpiData.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value.toLocaleString()}
            unit={kpi.unit}
            backgroundColor={index % 2 === 0 ? "#3B82F6" : "#F59E0B"}
            iconColor={index % 2 === 0 ? "#1D4ED8" : "#D97706"}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="p-6 shadow-lg">
          <h2 className="text-center text-lg font-semibold">항목별 비율</h2>
          <PieChart data={pieChartData} />
        </Card>
        <Card className="p-6 shadow-lg">
          <h2 className="text-center text-lg font-semibold">
            연도별 합계 변화
          </h2>
          <LineChart data={lineChartData} />
        </Card>
      </div>

      {/* Table */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">최근 10년 데이터</h2>
        <Table data={data.slice(0, 10).map((row) => ({ ...row }))} />
      </div>
    </Container>
  );
}

export default Sales;
