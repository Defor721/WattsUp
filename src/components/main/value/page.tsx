"use client";

import React, { useState, useEffect } from "react";

import Loading from "@/app/loading";
import { Card } from "@/components/shadcn";
import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

function TodayValue() {
  const [apiData, setApiData] = useState<{
    todaySmpData: {
      거래일: string;
      최고가: number;
      최소가: number;
      평균가: number;
    };
    todayRecData: {
      거래량: number;
      거래일: string;
      종가: number;
      최고가: number;
      최저가: number;
      평균가: number;
    };
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/crawl");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        // console.log("result: ", result);
        setApiData(result);
      } catch (error) {
        console.log("error: ", error);
        setError("데이터를 불러오는데 실패했습니다. 나중에 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading || !apiData) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-8 text-center text-3xl font-bold">오늘의 전력정보</h1>
      <div className="flex justify-center gap-7">
        {/* 오늘의 SMP */}
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
                  {apiData?.todaySmpData.거래일 || "-"}
                </td>
              </tr>
              <tr className="border-t">
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  최고가
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {apiData?.todaySmpData.최고가 || "-"}
                </td>
              </tr>
              <tr className="border-t">
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  최소가
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {apiData?.todaySmpData.최소가 || "-"}
                </td>
              </tr>
              <tr className="border-t">
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  평균가
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {apiData?.todaySmpData.평균가 || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </Card>

        {/* 오늘의 REC */}
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
                  {apiData?.todayRecData.거래일 || "-"}
                </td>
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  거래량
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {apiData?.todayRecData.거래량.toLocaleString() || "-"}
                </td>
              </tr>
              <tr className="border-t">
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  평균가
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {formatNumberWithoutDecimal(apiData.todayRecData.평균가) ||
                    "-"}
                </td>
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  최고가
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {formatNumberWithoutDecimal(apiData.todayRecData.최고가) ||
                    "-"}
                </td>
              </tr>
              <tr className="border-t">
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  최저가
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {formatNumberWithoutDecimal(apiData.todayRecData.최저가) ||
                    "-"}
                </td>
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  종가
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {formatNumberWithoutDecimal(apiData.todayRecData.종가) || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

export default TodayValue;
