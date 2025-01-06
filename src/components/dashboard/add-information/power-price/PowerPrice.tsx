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
import { formatNumberWithDecimal } from "@/hooks/useNumberFormatter";

import KPICard from "./KPICard";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
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
  [key: string]: string | number;
}

// COLORS 정의
const COLORS = {
  주택용: "#34D399", // 녹색
  일반용: "#60A5FA", // 파랑
  교육용: "#F87171", // 빨강
  산업용: "#fba524", // 노랑
  농사용: "#93C5FD", // 연파랑
  가로등: "#A78BFA", // 보라
  심야: "#FCA5A5", // 연분홍
};

function PowerPrice() {
  const [data, setData] = useState<DataRow[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [currentData, setCurrentData] = useState<DataRow | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 데이터 불러오기
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(
          "/assets/dashboards/HOME_Sales price.xlsx",
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
            주택용: Number(row["주택용"]),
            일반용: Number(row["일반용"]),
            교육용: Number(row["교육용"]),
            산업용: Number(row["산업용"]),
            농사용: Number(row["농사용"]),
            가로등: Number(row["가로등"]),
            심야: Number(row["심야"]),
            합계: Number(row["합계"]),
          }));
        setData(jsonData);
        setSelectedYear(jsonData[0]?.연도 || 2023);
        setCurrentData(jsonData[0]);
      } catch (error) {
        console.log("Error: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 연도 변경
  useEffect(() => {
    const yearData = data.find((row) => row.연도 === selectedYear);
    setCurrentData(yearData || null);
  }, [selectedYear, data]);

  // 데이터 다운로드
  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SalesPrice");
    XLSX.writeFile(workbook, "SalesPriceData.xlsx");
  };

  // 차트 데이터 생성
  const generateBarChartData = (): Array<{ name: string; value: number }> =>
    data
      .sort((a, b) => a.연도 - b.연도)
      .map((row) => ({
        name: row.연도.toString(),
        value: row.합계,
      }));

  const generatePieChartData = (): Array<{ name: string; value: number }> =>
    currentData
      ? Object.keys(COLORS).map((key) => ({
          name: key,
          value: currentData[key] as number,
        }))
      : [];

  const pieChartColors = Object.values(COLORS);

  return (
    <Container>
      <div className="mb-6 flex items-center justify-between gap-4">
        {/* 연도 선택 */}
        <div className="flex items-center gap-3">
          <Label
            htmlFor="year"
            className="text-mainColor dark:text-white md:text-base"
          >
            연도 선택
          </Label>
          <Select
            value={String(selectedYear)} // value는 string이어야 하므로 변환 필요
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
                    key={row.연도}
                    value={String(row.연도)}
                    className="z-10 bg-white dark:bg-subColor"
                  >
                    {row.연도}년
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* 데이터 다운로드 버튼 */}
        <Button
          onClick={handleDownload}
          className="bg-subColor text-white dark:bg-white dark:text-subColor"
        >
          <Download size={16} />
          데이터 다운로드
        </Button>
      </div>

      {currentData && (
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Object.keys(COLORS).map((key) => (
            <KPICard
              key={key}
              title={key}
              value={`${formatNumberWithDecimal(
                currentData[key] as number,
              )} 원`}
              backgroundColor={COLORS[key as keyof typeof COLORS]}
            />
          ))}
        </div>
      )}

      <div className="flex gap-6">
        <Card className="flex-1 p-6 shadow-lg">
          <h2 className="mb-4 text-center text-xl font-bold">비중 차트</h2>
          <div className="flex items-center justify-center">
            {/* 파이차트 */}
            <div className="w-[450px]">
              <PieChart data={generatePieChartData()} colors={pieChartColors} />
            </div>

            {/* 데이터 항목 표시 */}
            <div className="flex flex-col gap-2">
              {generatePieChartData()
                .map((item, index) => ({
                  ...item,
                  color: pieChartColors[index % pieChartColors.length], // 색상 추가
                }))
                .sort((a, b) => b.value - a.value) // 값을 기준으로 내림차순 정렬
                .map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200"
                  >
                    {/* 색상 점 */}
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{
                        backgroundColor: item.color, // 색상 일치
                      }}
                    ></div>
                    {/* 데이터 이름과 값 */}
                    <span>
                      {item.name}: {formatNumberWithDecimal(item.value)} 원
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </Card>
        <Card className="flex-1 p-6 shadow-lg">
          <h2 className="mb-4 text-center text-xl font-bold">판매 단가 총합</h2>
          <BarChart data={generateBarChartData()} />
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="mb-4 text-xl font-bold">최근 10년 데이터(단위: 원)</h2>
        <Table data={[...data].sort((a, b) => b.연도 - a.연도).slice(0, 10)} />
      </div>
    </Container>
  );
}

export default PowerPrice;
