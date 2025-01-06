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
import Loading from "@/app/loading";

import Container from "../Container";
import KPICard from "./KPICard";
import AverageCost from "./AverageCost";
import PowerList from "./PowerList";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import AreaChart from "./AreaChart";

interface PowerData {
  연도: number;
  "발전설비총계(MW)": number;
  "총발전량총계(GWh)": number;
  "부하율(%)": number;
  "이용율(%)": number;
  "평균판매단가(원/kWh)": number;
  "수력(GWh)": number;
  "화력(GWh)": number;
  "원자력(GWh)": number;
  "자가용(GWh)": number;
}

function Electro() {
  const [data, setData] = useState<PowerData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [currentYearData, setCurrentYearData] = useState<PowerData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 데이터 정규화 함수
  const normalizeData = (row: Record<string, any>): PowerData => {
    try {
      return {
        연도: Number(row["연도"]),
        "발전설비총계(MW)": Number(row["발전설비총계(MW)"]),
        "총발전량총계(GWh)": Number(row["총발전량총계(GWh)"]),
        "부하율(%)": Number(row["부하율(%)"]),
        "이용율(%)": Number(row["이용율(%)"]),
        "평균판매단가(원/kWh)": Number(row["평균판매단가(원/kWh)"]),
        "수력(GWh)": Number(row["수력(GWh)"]),
        "화력(GWh)": Number(row["화력(GWh)"]),
        "원자력(GWh)": Number(row["원자력(GWh)"]),
        "자가용(GWh)": Number(row["자가용(GWh)"]),
      };
    } catch (err) {
      console.error("Failed to normalize data:", row, err);
      throw new Error("Invalid data format");
    }
  };

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "/assets/dashboards/HOME_Main indicators_Power indicators.xlsx",
        );
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
          type: "array",
        });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const jsonData: PowerData[] = XLSX.utils
          .sheet_to_json<Record<string, any>>(worksheet)
          .map(normalizeData);

        const sortedData = jsonData.sort((a, b) => a.연도 - b.연도);
        setData(sortedData);

        const latestYear = sortedData[sortedData.length - 1]?.연도 || null;
        setSelectedYear(latestYear);
        setCurrentYearData(
          sortedData.find((item) => item.연도 === latestYear) || null,
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

  // 선택된 연도에 따른 데이터 설정
  useEffect(() => {
    if (selectedYear) {
      const yearData = data.find((item) => item.연도 === selectedYear);
      setCurrentYearData(yearData || null);
    }
  }, [selectedYear, data]);

  // 이전 연도 데이터 생성
  const getPreviousYearData = (): { name: string; value: number }[] => {
    if (!selectedYear) return [];
    const previousYear = selectedYear - 1;
    const previousYearData = data.find((item) => item.연도 === previousYear);
    return previousYearData
      ? [
          { name: "수력", value: previousYearData["수력(GWh)"] },
          { name: "화력", value: previousYearData["화력(GWh)"] },
          { name: "원자력", value: previousYearData["원자력(GWh)"] },
          { name: "자가용", value: previousYearData["자가용(GWh)"] },
        ]
      : [];
  };

  // 다운로드 함수
  const handleDownload = () => {
    if (!data.length) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Power Data");
    XLSX.writeFile(workbook, "PowerDashboardData.xlsx");
  };

  if (isLoading) return <Loading />;

  if (!currentYearData) return <div>데이터가 없습니다.</div>;

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
          className="bg-subColor text-white dark:border-1"
        >
          <Download size={16} />
          데이터 다운로드
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="발전설비총계"
          value={`${currentYearData["발전설비총계(MW)"].toLocaleString()} MW`}
          icon={<BatteryCharging size={24} color="#FFFFFF" />}
          backgroundColor="#6D28D9"
          iconColor="#A855F7"
        />
        <KPICard
          title="총발전량"
          value={`${currentYearData["총발전량총계(GWh)"].toLocaleString()} GWh`}
          icon={<Activity size={24} color="#FFFFFF" />}
          backgroundColor="#22C55E"
          iconColor="#16A34A"
        />
        <KPICard
          title="부하율"
          value={`${currentYearData["부하율(%)"]}%`}
          icon={<TrendingUp size={24} color="#FFFFFF" />}
          backgroundColor="#F59E0B"
          iconColor="#FACC15"
        />
        <KPICard
          title="이용율"
          value={`${currentYearData["이용율(%)"]}%`}
          icon={<TrendingDown size={24} color="#FFFFFF" />}
          backgroundColor="#3B82F6"
          iconColor="#2563EB"
        />
      </div>

      {/* Average Cost and PowerList */}
      <div className="flex gap-6">
        <Card className="flex-1 rounded-lg p-6 shadow-lg">
          <AverageCost
            value={currentYearData["평균판매단가(원/kWh)"]}
            maxValue={200}
          />
        </Card>
        <Card className="flex-1 rounded-lg p-6 shadow-lg">
          <PowerList data={currentYearData} />
        </Card>
      </div>

      {/* 차트 섹션 */}
      <div className="mt-8">
        <div className="flex gap-6">
          <Card className="flex-1 p-6 shadow-lg">
            <h2 className="mb-4 text-center text-lg font-semibold">
              연도별 발전량 추이
            </h2>
            <LineChart
              data={data
                .sort((a, b) => a.연도 - b.연도)
                .map((item) => ({
                  연도: item.연도,
                  수력: item["수력(GWh)"],
                  화력: item["화력(GWh)"],
                  원자력: item["원자력(GWh)"],
                  자가용: item["자가용(GWh)"],
                }))}
            />
          </Card>
          <Card className="flex flex-col p-6 shadow-lg">
            <h2 className="text-center text-lg font-semibold">총발전량 비율</h2>
            <div className="flex items-center justify-center">
              {/* 파이차트 */}
              <div className="w-[450px]">
                <PieChart
                  data={{
                    수력: currentYearData["수력(GWh)"],
                    화력: currentYearData["화력(GWh)"],
                    원자력: currentYearData["원자력(GWh)"],
                    자가용: currentYearData["자가용(GWh)"],
                  }}
                  colors={["#60a5fa", "#facc15", "#f87171", "#4ade80"]}
                />
              </div>

              {/* 데이터 항목 표시 */}
              <div className="flex flex-col gap-2">
                {[
                  {
                    name: "수력",
                    value: currentYearData["수력(GWh)"],
                    color: "#3B82F6",
                  },
                  {
                    name: "화력",
                    value: currentYearData["화력(GWh)"],
                    color: "#F59E0B",
                  },
                  {
                    name: "원자력",
                    value: currentYearData["원자력(GWh)"],
                    color: "#EF4444",
                  },
                  {
                    name: "자가용",
                    value: currentYearData["자가용(GWh)"],
                    color: "#22C55E",
                  },
                ]
                  .sort((a, b) => b.value - a.value)
                  .map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200"
                    >
                      {/* 색상 점 */}
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      {/* 데이터 값 */}
                      <span>
                        {item.name}: {formatNumberWithoutDecimal(item.value)}
                        GWh
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        </div>
        <Card className="mt-8 w-full p-6 shadow-lg">
          <h2 className="mb-4 text-center text-lg font-semibold">
            연도별 전력 발전량 비교
          </h2>
          <AreaChart
            previousYearData={getPreviousYearData()}
            currentYearData={[
              { name: "수력", value: currentYearData["수력(GWh)"] },
              { name: "화력", value: currentYearData["화력(GWh)"] },
              { name: "원자력", value: currentYearData["원자력(GWh)"] },
              { name: "자가용", value: currentYearData["자가용(GWh)"] },
            ]}
          />
        </Card>
      </div>
    </Container>
  );
}

export default Electro;
