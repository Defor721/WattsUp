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
import Loading from "@/app/loading";

import { KPICard } from "./KPICard";
import Table from "./Table";
import Container from "../Container";
import Total from "./Total";
import LineChart from "./LineChart";

export interface DataRow {
  연도: number;
  원자력: number;
  가스: number;
  유연탄: number;
  신재생: number;
  수력: number;
  // 총계: number;
  // 총발전량: number;
}

interface KPIConfig {
  [key: string]: {
    color: string;
    unit: string;
    value?: number; // `value`는 선택 속성
  };
}

export const colorConfig = {
  수력: "#60A5FA", // 파란색 (수력)
  원자력: "#FF5733", // 오렌지색 (원자력)
  신재생: "#F87171", // 빨간색 (신재생)
  가스: "#34D399", // 초록색 (가스)
  유연탄: "#6B7280", // 회색 (유연탄)
};

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

        // 원하는 값만 추출
        const formattedData: DataRow[] = jsonData.map((row: any) => ({
          연도: Number(row["연도"]),
          원자력: Number(row["원자력"] || 0),
          가스: Number(row["가스"] || 0),
          유연탄: Number(row["유연탄"] || 0),
          신재생: Number(row["신재생"] || 0),
          수력: Number(row["수력소계"] || 0),
          // 국내탄: Number(row["국내탄"] || 0),
        }));

        setData(formattedData);
        // console.log("Filtered Data: ", formattedData);
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
  const totalGeneration =
    (currentYearData?.수력 || 0) +
    (currentYearData?.원자력 || 0) +
    (currentYearData?.신재생 || 0) +
    (currentYearData?.가스 || 0) +
    (currentYearData?.유연탄 || 0);

  const kpiConfig: KPIConfig = {
    수력: {
      color: colorConfig.수력,
      unit: "MWh",
      value: currentYearData?.수력 || 0,
    },
    원자력: {
      color: colorConfig.원자력,
      unit: "MWh",
      value: currentYearData?.원자력 || 0,
    },
    신재생: {
      color: colorConfig.신재생,
      unit: "MWh",
      value: currentYearData?.신재생 || 0,
    },
    가스: {
      color: colorConfig.가스,
      unit: "MWh",
      value: currentYearData?.가스 || 0,
    },
    유연탄: {
      color: colorConfig.유연탄,
      unit: "MWh",
      value: currentYearData?.유연탄 || 0,
    },
    총발전량: {
      color: "#4ADE80", // 총발전량의 색상은 고정
      unit: "MWh",
      value: totalGeneration,
    },
  };

  const totalData = data.map((row) => {
    const totalGeneration =
      row.원자력 + row.가스 + row.유연탄 + row.신재생 + row.수력;
    return {
      연도: row.연도,
      총발전량: totalGeneration,
    };
  });

  const tableData = data.map((row) => {
    const totalGeneration =
      row.원자력 + row.가스 + row.유연탄 + row.신재생 + row.수력; // 모든 필요한 필드 합산
    return {
      연도: row.연도,
      수력: row.수력,
      원자력: row.원자력,
      신재생: row.신재생,
      가스: row.가스,
      유연탄: row.유연탄,
      총발전량: totalGeneration,
    };
  });

  if (loading) {
    return <Loading />;
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
          className="bg-subColor text-white dark:border-1"
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
          <h2 className="mb-4 text-center text-xl font-bold">
            발전원별 발전량
          </h2>
          <LineChart
            data={[...data].sort((a, b) => a.연도 - b.연도)}
            colors={colorConfig}
          />
        </div>
        <div>
          <h2 className="mb-4 text-center text-xl font-bold">총발전량 추이</h2>
          <Total data={[...totalData].sort((a, b) => a.연도 - b.연도)} />
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
