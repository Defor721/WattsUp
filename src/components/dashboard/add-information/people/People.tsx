import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  BatteryCharging,
  TrendingUp,
  TrendingDown,
  Activity,
  Download,
} from "lucide-react";

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
import Loading from "@/app/loading";

import Container from "../Container";
import KPICard from "./KPICard";
import AreaChart from "./AreaChart";
import LineChart from "./LineChart";
import Table from "./Table";

interface DataRow {
  연도: number;
  경제성장률: number;
  국내총생산: number;
  국민총소득: number;
  국민총소득_1인당: number;
  총저축률: number;
  국내총투자율: number;
}

const kpiConfig = {
  경제성장률: {
    icon: <TrendingUp size={24} />,
    backgroundColor: "#34D399", // 부드러운 초록색
    unit: "%",
  },
  국내총생산: {
    icon: <BatteryCharging size={24} />,
    backgroundColor: "#60A5FA", // 차분한 파랑색
    unit: "억원",
  },
  국민총소득: {
    icon: <Activity size={24} />,
    backgroundColor: "#FBBF24", // 밝은 노란색
    unit: "억원",
  },
  국민총소득_1인당: {
    icon: <TrendingUp size={24} />,
    backgroundColor: "#A3E635", // 라임 그린
    unit: "US$",
  },
  총저축률: {
    icon: <TrendingDown size={24} />,
    backgroundColor: "#F87171", // 부드러운 빨강색
    unit: "%",
  },
  국내총투자율: {
    icon: <Activity size={24} />,
    backgroundColor: "#93C5FD", // 밝은 하늘색
    unit: "%",
  },
};

export const formatKPIKeys = (key: string): string => {
  const formattedKeys: Record<string, string> = {
    경제성장률: "경제 성장률",
    국내총생산: "국내 총 생산",
    국민총소득: "국민 총 소득",
    국민총소득_1인당: "국민 총 소득 1인당",
    총저축률: "총 저축률",
    국내총투자율: "국내 총 투자율",
  };
  return formattedKeys[key] || key;
};

function People() {
  const [data, setData] = useState<DataRow[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [currentKPI, setCurrentKPI] = useState<DataRow | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(
          "/assets/dashboards/HOME_Main indicators_National accounts.xlsx",
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
            경제성장률: Number(row["경제성장률(%)"]),
            국내총생산: Number(row["국내총생산(10억원)"]),
            국민총소득: Number(row["국민총소득(10억원)"]),
            국민총소득_1인당: Number(row["1인당 국민총소득(US$)"]),
            총저축률: Number(row["총저축률(%)"]),
            국내총투자율: Number(row["국내총투자율(%)"]),
          }));
        setData(jsonData);
        setSelectedYear(jsonData[0]?.연도 || 2023);
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

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "National Accounts Data");
    XLSX.writeFile(workbook, "NationalAccountDashboardData.xlsx");
  };

  if (isLoading) {
    return <Loading />;
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
            value={selectedYear.toString()}
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
          className="bg-subColor text-white dark:bg-white dark:text-subColor"
        >
          <Download size={16} />
          데이터 다운로드
        </Button>
      </div>

      <div className="flex flex-col gap-cardGap">
        {currentKPI && (
          <div className="grid grid-cols-1 gap-cardGap md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(currentKPI).map(([key, value]) => {
              if (key === "연도") return null;
              const config = kpiConfig[key as keyof typeof kpiConfig];
              return (
                <KPICard
                  key={key}
                  title={formatKPIKeys(key)}
                  value={`${value.toLocaleString()} ${config.unit}`}
                  backgroundColor={config.backgroundColor}
                />
              );
            })}
          </div>
        )}

        <div className="flex flex-col gap-cardGap">
          <Card className="border-none bg-cardBackground-light p-cardPadding dark:bg-cardBackground-dark">
            <div className="flex flex-col gap-2">
              <h2 className="mb-3 text-center text-lg font-semibold">
                경제 성장률 데이터
              </h2>
              <AreaChart
                data={[...data]
                  .sort((a, b) => a.연도 - b.연도)
                  .map((row) => ({ 연도: row.연도, 값: row.경제성장률 }))}
                xKey="연도"
                yKey="값"
              />
            </div>
          </Card>
          <Card className="border-none bg-cardBackground-light p-cardPadding dark:bg-cardBackground-dark">
            <div className="flex flex-col gap-2">
              <h2 className="mb-3 text-center text-lg font-semibold">
                국내 총 생산 추이
              </h2>
              <LineChart
                data={[...data]
                  .sort((a, b) => a.연도 - b.연도)
                  .map((row) => ({ 연도: row.연도, 값: row.국내총생산 }))}
                xKey="연도"
                yKey="값"
              />
            </div>
          </Card>
        </div>
      </div>
      <Card className="mt-4 border-none bg-cardBackground-light p-cardPadding dark:bg-cardBackground-dark">
        <h2 className="mb-4 text-lg font-semibold">
          최근 10년간 국민 계정 데이터
        </h2>
        <Table
          data={data.slice(0, 10).map((row) => ({
            연도: row.연도,
            국민총소득: row.국민총소득,
            경제성장률: row.경제성장률,
            상태: row.경제성장률 > 0 ? "긍정" : "부정",
          }))}
        />
      </Card>
    </Container>
  );
}

export default People;
