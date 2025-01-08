"use client";

import React, { useEffect, useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/shadcn";
import {
  formatNumberWithDecimal,
  formatNumberWithoutDecimal,
} from "@/hooks/useNumberFormatter";

interface Data {
  date: string;
  amgo: number;
}

interface TodayValueProps {
  selectedRegion: string;
  data: Data[];
}

// function TodayValue({ selectedRegion, data }: TodayValueProps) {
function TodayValue() {
  const [smpData, setSmpData] = useState();
  const [recData, setRecData] = useState();
  const [amgo, setAmgo] = useState("");

  // useEffect(() => {
  //   if (data) {
  //     const formatData = formatNumberWithDecimal(data[0].amgo);
  //     setAmgo(formatData);
  //   }
  // }, [data, selectedRegion]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/crawl");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        console.log("크롤링 데이터:", result);
        setSmpData(result.todaySmpData);
        setRecData(result.todayRecData);
      } catch (error: any) {
        console.error("API 호출 실패:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-8 text-center text-3xl font-bold">오늘의 전력정보</h1>
      {/* <div className="flex justify-center gap-7">
        <Card className="h-[300px] w-[488px] p-4 shadow-md">
          <div className="py-3 text-center text-lg font-semibold">
            오늘의 SMP
          </div>
          <div className="mb-2 mt-3 flex justify-end text-xs text-gray-500">
            (단위: 원/kWh)
          </div>

          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-t">
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  거래일
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {smpData?.거래일 || "-"}
                </td>
              </tr>
              <tr className="border-t">
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  최고가
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {smpData?.최고가 || "-"}
                </td>
              </tr>
              <tr className="border-t">
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  최소가
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {smpData?.최소가 || "-"}
                </td>
              </tr>
              <tr className="border-t">
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  평균가
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {smpData?.평균가 || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </Card>

        <Card className="h-[300px] w-[488px] p-4 shadow-md">
          <div className="py-3 text-center text-lg font-semibold">
            오늘의 REC
          </div>
          <div className="bg-blue-100 py-2 text-center text-sm font-medium text-blue-800">
            1REC = 1MWh (가중치에 따라 변동)
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="py-2 text-xs text-gray-600">
              ※ 매주 화, 목요일 10:00 ~ 16:00 개장
            </div>
            <div className="py-2 text-xs text-gray-600">
              (단위: REC, 원/REC)
            </div>
          </div>

          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-t">
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  거래일
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {recData?.거래일 || "-"}
                </td>
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  거래량
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {recData?.거래량.toLocaleString() || "-"}
                </td>
              </tr>
              <tr className="border-t">
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  평균가
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {formatNumberWithoutDecimal(recData.평균가) || "-"}
                </td>
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  최고가
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {formatNumberWithoutDecimal(recData.최고가) || "-"}
                </td>
              </tr>
              <tr className="border-t">
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  최저가
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {formatNumberWithoutDecimal(recData.최저가) || "-"}
                </td>
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  종가
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {formatNumberWithoutDecimal(recData.종가) || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div> */}
    </div>
  );
}

export default TodayValue;
