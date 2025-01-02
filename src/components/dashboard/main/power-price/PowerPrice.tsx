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

function PowerPrice() {
  const [data, setData] = useState<DataRow[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [currentData, setCurrentData] = useState<DataRow | null>(null);

  // 데이터 불러오기
  useEffect(() => {
    const loadData = async () => {
      const response = await fetch("/assets/dashboards/HOME_Sales price.xlsx");
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
      ? [
          { name: "주택용", value: currentData.주택용 },
          { name: "일반용", value: currentData.일반용 },
          { name: "교육용", value: currentData.교육용 },
          { name: "산업용", value: currentData.산업용 },
          { name: "농사용", value: currentData.농사용 },
          { name: "가로등", value: currentData.가로등 },
          { name: "심야", value: currentData.심야 },
        ]
      : [];

  const kpiConfig = {
    주택용: { color: "#1E88E5", unit: "원" },
    일반용: { color: "#F4511E", unit: "원" },
    산업용: { color: "#E53935", unit: "원" },
    합계: { color: "#1eec0bc7", unit: "원" },
  };

  // 색상 조합
  const pieChartColors = [
    "#1E88E5", // 블루
    "#F4511E", // 오렌지
    "#43A047", // 초록
    "#E53935", // 레드
    "#FB8C00", // 옐로우 오렌지
    "#8E24AA", // 퍼플
    "#3949AB", // 다크 블루
  ];

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
          {Object.entries(currentData)
            .filter(([key]) => kpiConfig[key as keyof typeof kpiConfig])
            .map(([key, value]) => {
              const config = kpiConfig[key as keyof typeof kpiConfig];
              return (
                <KPICard
                  key={key}
                  title={key}
                  value={`${value.toLocaleString()} ${config.unit}`}
                  backgroundColor={config.color}
                />
              );
            })}
        </div>
      )}

      <div className="flex gap-6">
        <Card className="flex-1 p-6 shadow-lg">
          <h2 className="mb-4 text-center text-xl font-bold">판매 단가 총합</h2>
          <BarChart data={generateBarChartData()} />
        </Card>
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
                .sort((a, b) => b.value - a.value) // 값을 기준으로 내림차순 정렬
                .map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200"
                  >
                    {/* 색상 점 */}
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{
                        backgroundColor:
                          pieChartColors[index % pieChartColors.length],
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
      </div>

      <div className="mt-6">
        <h2 className="mb-4 text-xl font-bold">최근 10년 데이터(단위: 원)</h2>
        <Table data={[...data].sort((a, b) => b.연도 - a.연도).slice(0, 10)} />
      </div>
    </Container>
  );
}

export default PowerPrice;
