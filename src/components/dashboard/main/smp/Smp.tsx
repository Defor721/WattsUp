"use client";

import React, { useEffect, useState } from "react";
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
} from "@/components/shadcn";

import Container from "../Container";
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import KPICard from "./KPICard";
import Table from "./Table";

interface SMPData {
  기간: string; // e.g., "2023/06"
  LNG: number;
  유류: number;
  무연탄: number;
  유연탄: number;
  원자력: number;
  총계: number;
}

function SMP() {
  const [data, setData] = useState<SMPData[]>([]);
  const [filteredData, setFilteredData] = useState<SMPData[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("전체");
  const [selectedFuel, setSelectedFuel] = useState<string>("전체");
  const [kpi, setKpi] = useState<{
    [key in keyof Omit<SMPData, "기간">]: number;
  }>({
    LNG: 0,
    유류: 0,
    무연탄: 0,
    유연탄: 0,
    원자력: 0,
    총계: 0,
  });

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/assets/dashboards/HOME_SMP.xlsx");
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
          type: "array",
        });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: SMPData[] = XLSX.utils
          .sheet_to_json<SMPData>(worksheet)
          .map((row: any) => ({
            기간: row["기간"],
            LNG: isNaN(Number(row["LNG"])) ? 0 : Number(row["LNG"]),
            유류: isNaN(Number(row["유류"])) ? 0 : Number(row["유류"]),
            무연탄: isNaN(Number(row["무연탄"])) ? 0 : Number(row["무연탄"]),
            유연탄: isNaN(Number(row["유연탄"])) ? 0 : Number(row["유연탄"]),
            원자력: isNaN(Number(row["원자력"])) ? 0 : Number(row["원자력"]),
            총계: isNaN(Number(row["총계"])) ? 0 : Number(row["총계"]),
          }));
        setData(jsonData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, []);

  // 데이터 필터링 및 KPI 계산
  useEffect(() => {
    // 연 단위로 데이터를 집계
    const yearlyData = data.reduce<Record<string, SMPData>>((acc, curr) => {
      const year = curr.기간.split("/")[0]; // 연도 추출
      if (!acc[year]) {
        acc[year] = {
          기간: year,
          LNG: 0,
          유류: 0,
          무연탄: 0,
          유연탄: 0,
          원자력: 0,
          총계: 0,
        };
      }
      acc[year].LNG += curr.LNG;
      acc[year].유류 += curr.유류;
      acc[year].무연탄 += curr.무연탄;
      acc[year].유연탄 += curr.유연탄;
      acc[year].원자력 += curr.원자력;
      acc[year].총계 += curr.총계;

      return acc;
    }, {});

    // 정렬된 연도별 데이터
    const sortedYearlyData = Object.values(yearlyData).sort(
      (a, b) => Number(a.기간) - Number(b.기간),
    );

    setFilteredData(sortedYearlyData);

    // KPI 계산
    const totalKPI = sortedYearlyData.reduce(
      (totals, item) => {
        totals.LNG += item.LNG;
        totals.유류 += item.유류;
        totals.무연탄 += item.무연탄;
        totals.유연탄 += item.유연탄;
        totals.원자력 += item.원자력;
        totals.총계 += item.총계;
        return totals;
      },
      {
        LNG: 0,
        유류: 0,
        무연탄: 0,
        유연탄: 0,
        원자력: 0,
        총계: 0,
      },
    );

    setKpi(totalKPI);
  }, [data]);

  // 데이터 다운로드
  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SMP Data");
    XLSX.writeFile(workbook, "SMP_Data.xlsx");
  };

  // 도넛 차트 데이터
  const doughnutData = Object.keys(kpi)
    .filter((key) => key !== "총계") // 총계 제외
    .map((key) => ({
      name: key,
      value: kpi[key as keyof typeof kpi],
    }));

  const colors = ["#34D399", "#60A5FA", "#F87171", "#93C5FD", "#FBBF24"];

  // 라인 차트 데이터
  const lineChartData = filteredData.map((item) => ({
    name: item.기간,
    value:
      selectedFuel === "전체"
        ? item.총계
        : Number(item[selectedFuel as keyof SMPData] || 0),
  }));

  return (
    <Container>
      {/* 필터와 다운로드 */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center justify-end gap-3">
          <Label
            htmlFor="fuel"
            className="text-mainColor dark:text-white md:text-base"
          >
            연료원 선택
          </Label>
          <Select
            value={selectedFuel}
            onValueChange={(value) => setSelectedFuel(value)}
          >
            <SelectTrigger id="fuel" className="w-[180px]">
              <SelectValue placeholder="연료원 선택" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-subColor">
              {["전체", "LNG", "유류", "무연탄", "유연탄", "원자력"].map(
                (fuel) => (
                  <SelectItem
                    className="z-10 bg-white dark:bg-subColor"
                    key={fuel}
                    value={fuel}
                  >
                    {fuel}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleDownload}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <Download size={16} />
          데이터 다운로드
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
        {Object.keys(kpi).map((key) => (
          <KPICard
            key={key}
            title={key}
            value={kpi[key as keyof typeof kpi].toLocaleString()}
            unit="MWh"
            backgroundColor="#3B82F6"
            iconColor="#1D4ED8"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold">연료원별 전체 비율</h2>
          <PieChart data={doughnutData} colors={colors} />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold">
            {selectedFuel} 기간별 SMP 추이
          </h2>
          <LineChart
            data={lineChartData}
            xKey="name"
            yKey="value"
            lineColor="#34D399"
          />
        </div>
      </div>

      {/* Table */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">세부 데이터</h2>
        <Table data={filteredData} />
      </div>
    </Container>
  );
}

export default SMP;
