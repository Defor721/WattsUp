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
} from "@/components/shadcn";

import Container from "../Container";
import KPICard from "./KPICard";
import BarChart from "./BarChart";
import LineChart from "./LineChart";

interface DataRow {
  연도: number;
  발전설비_건: number;
  송전설비_건: number;
  변전설비_건: number;
  배전설비_건: number;
  총계_건: number;
}

function Failures() {
  const [data, setData] = useState<DataRow[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [currentKPI, setCurrentKPI] = useState<DataRow | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Equipment Data");
    XLSX.writeFile(workbook, "EquipmentDashboardData.xlsx");
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(
          "/assets/dashboards/HOME_Electrical equipment_Trend of electrical failures by type.xlsx",
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
            발전설비_건: Number(row["발전설비(건)"]),
            송전설비_건: Number(row["송전설비(건)"]),
            변전설비_건: Number(row["변전설비(건)"]),
            배전설비_건: Number(row["배전설비(건)"]),
            총계_건: Number(row["총계(건)"]),
          }));
        setData(jsonData);
        setSelectedYear(jsonData[0]?.연도 || null);
        setCurrentKPI(jsonData[0]);
      } catch (error) {
        console.log("Error: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const yearData = data.find((row) => row.연도 === selectedYear);
    setCurrentKPI(yearData || null);
  }, [selectedYear, data]);

  return (
    <Container>
      <h1 className="mb-6 text-center text-4xl font-bold">
        전기 설비 고장 대시보드
      </h1>
      {/* 연도 선택 */}
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
              {data.map((row) => (
                <SelectItem
                  className="z-10 bg-white dark:bg-subColor"
                  key={row.연도}
                  value={String(row.연도)}
                >
                  {row.연도}
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

      {/* KPI 카드 */}
      {currentKPI && (
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <KPICard
            title="발전설비"
            value={`${currentKPI.발전설비_건} 건`}
            backgroundColor="#34D399"
          />
          <KPICard
            title="송전설비"
            value={`${currentKPI.송전설비_건} 건`}
            backgroundColor="#60A5FA"
          />
          <KPICard
            title="변전설비"
            value={`${currentKPI.변전설비_건} 건`}
            backgroundColor="#FBBF24"
          />
          <KPICard
            title="총계"
            value={`${currentKPI.총계_건} 건`}
            backgroundColor="#EF4444"
          />
        </div>
      )}
      {/* 차트 */}
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="mb-3 text-center text-lg font-semibold">
            연도별 설비 고장 건수 비교
          </h2>
          <BarChart
            data={data
              .sort((a, b) => a.연도 - b.연도)
              .map((row) => ({
                연도: row.연도,
                발전설비: row.발전설비_건,
                송전설비: row.송전설비_건,
                변전설비: row.변전설비_건,
                배전설비: row.배전설비_건,
              }))}
            keys={["발전설비", "송전설비", "변전설비", "배전설비"]}
          />
        </div>
        <div>
          <h2 className="mb-3 text-center text-lg font-semibold">
            연도별 설비 고장 총계 추이
          </h2>
          <LineChart
            data={data.map((row) => ({
              연도: row.연도,
              총계: row.총계_건,
            }))}
            dataKey="총계"
          />
        </div>
      </div>
    </Container>
  );
}

export default Failures;
