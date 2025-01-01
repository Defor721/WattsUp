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

import { KPICard } from "./KPICard";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import Table from "./Table";
import Container from "../Container";

export interface DataRow {
  연도: number;
  일반수력: number;
  양수: number;
  소수력: number;
  수력: number;
  무연탄: number;
  유연탄: number;
  중유: number;
  가스: number;
  기력소계: number;
  복합화력일반: number;
  복합화력열공급: number;
  복합화력총계: number;
  원자력: number;
  신재생: number;
  집단: number;
  내연력: number;
  기타: number;
  총계: number;
  총발전량: number;
}

interface KPIConfig {
  [key: string]: {
    color: string;
    unit: string;
    value?: number; // `value`는 선택 속성
  };
}

function PowerGeneration() {
  const [data, setData] = useState<DataRow[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "/assets/dashboards/HOME_generationQuantity.xlsx",
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
          type: "array",
        });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          throw new Error("데이터를 찾을 수 없습니다");
        }

        const formattedData: DataRow[] = jsonData.map((row: any) => ({
          연도: Number(row["연도"]),
          일반수력: Number(row["일반수력"] || 0),
          양수: Number(row["양수"] || 0),
          소수력: Number(row["소수력"] || 0),
          수력: Number(row["수력소계"] || 0),
          무연탄: Number(row["무연탄"] || 0),
          유연탄: Number(row["유연탄"] || 0),
          중유: Number(row["중유"] || 0),
          가스: Number(row["가스"] || 0),
          기력소계: Number(row["기력소계"] || 0),
          복합화력일반: Number(row["복합화력일반"] || 0),
          복합화력열공급: Number(row["복합화력열공급"] || 0),
          복합화력총계: Number(row["복합화력총계"] || 0),
          원자력: Number(row["원자력"] || 0),
          신재생: Number(row["신재생"] || 0),
          집단: Number(row["집단"] || 0),
          내연력: Number(row["내연력"] || 0),
          기타: Number(row["기타"] || 0),
          총계: Number(row["총계"] || 0),
          총발전량: Number(row["총발전량"] || 0),
        }));

        setData(formattedData);
        console.log("formattedData: ", formattedData);
        setSelectedYear(formattedData[0]?.연도 || 2023);
        setError(null);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        setError(
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDownload = () => {
    console.log("다운로드 클릭");
  };

  const currentYearData = data.find((row) => row.연도 === selectedYear);

  const totalRenewableEnergy =
    (currentYearData?.수력 || 0) +
    (currentYearData?.원자력 || 0) +
    (currentYearData?.신재생 || 0);
  console.log("totalRenewableEnergy: ", totalRenewableEnergy);

  const kpiConfig: KPIConfig = {
    총발전량: { color: "#4ADE80", unit: "MWh", value: totalRenewableEnergy },
    수력: { color: "#60A5FA", unit: "MWh" },
    원자력: { color: "#FBBF24", unit: "MWh" },
    신재생: { color: "#F87171", unit: "MWh" },
  };

  const chartData = data.map((row) => ({
    연도: row.연도,
    총발전량: row.수력 + row.원자력 + row.신재생,
  }));

  const tableData = data.map((row) => ({
    연도: row.연도,
    수력: row.수력,
    원자력: row.원자력,
    신재생: row.신재생,
    총발전량: row.수력 + row.원자력 + row.신재생,
  }));

  if (error) {
    return (
      <div className="text-center text-red-500">
        <h2 className="mb-4 text-2xl font-bold">오류 발생</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold">데이터 로딩 중...</h2>
      </div>
    );
  }

  return (
    <Container>
      {/* 연도 선택 */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
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
        <Button
          onClick={handleDownload}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <Download size={16} />
          데이터 다운로드
        </Button>
      </div>

      {/* KPI 카드 그리드 */}
      {currentYearData && (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(kpiConfig).map(([key, config]) => (
            <KPICard
              key={key}
              title={key}
              value={`${
                key === "총발전량"
                  ? config.value?.toLocaleString()
                  : currentYearData[key as keyof DataRow]?.toLocaleString()
              } ${config.unit}`}
              backgroundColor={config.color}
            />
          ))}
        </div>
      )}

      {/* 차트 섹션 */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-center text-xl font-bold">총발전량 추이</h2>
          <LineChart data={[...chartData].sort((a, b) => a.연도 - b.연도)} />
        </div>
        <div>
          <h2 className="mb-4 text-center text-xl font-bold">
            발전원별 발전량
          </h2>
          <BarChart data={[...data].sort((a, b) => a.연도 - b.연도)} />
        </div>
      </div>

      {/* 최근 데이터 테이블 */}
      <div>
        <h2 className="mb-4 text-xl font-bold">
          최근 5년간 발전량 데이터(단위: MWh)
        </h2>
        <Table data={tableData.slice(0, 5)} />
      </div>
    </Container>
  );
}

export default PowerGeneration;
