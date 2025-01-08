"use client";

import React, { useState, useEffect } from "react";

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
    let isMounted = true; // 컴포넌트가 언마운트 되었는지 확인

    const fetchData = async () => {
      try {
        const response = await fetch("/api/crawl");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        if (isMounted) {
          setApiData(result);
        }
      } catch (error) {
        if (isMounted) {
          setError(
            "데이터를 불러오는데 실패했습니다. 나중에 다시 시도해주세요.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // 컴포넌트 언마운트 시 상태 업데이트 방지
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  if (!apiData) {
    return null; // 데이터가 없을 경우 안전하게 반환
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-8 text-center text-3xl font-bold">오늘의 전력정보</h1>
      <div className="grid grid-cols-1 justify-center gap-cardGap xl:grid-cols-2">
        <Card className="h-[300px] w-[488px] border-none bg-cardBackground-light p-4 shadow-md dark:bg-cardBackground-dark">
          <div className="py-3 text-center text-lg font-semibold">
            오늘의 SMP
          </div>
          <div className="mb-2 mt-3 flex justify-end text-xs text-gray-500">
            (단위: 원/kWh)
          </div>
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-t [&>*]:text-center">
                <td className="border border-gray-300 p-3 font-medium">
                  거래일
                </td>
                <td className="border border-gray-300 p-3">
                  {apiData.todaySmpData.거래일 || "-"}
                </td>
              </tr>
              <tr className="border-t [&>*]:text-center">
                <td className="border border-gray-300 p-3 font-medium">
                  최고가
                </td>
                <td className="border border-gray-300 p-3">
                  {apiData.todaySmpData.최고가 || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
        {/* 오늘의 REC */}
        <Card className="h-[300px] w-[488px] border-none bg-cardBackground-light p-4 shadow-md dark:bg-cardBackground-dark">
          <div className="py-3 text-center text-lg font-semibold">
            오늘의 REC
          </div>
          <div className="bg-blue-100 py-2 text-center text-sm font-medium text-blue-800">
            1REC = 1MWh (가중치에 따라 변동)
          </div>
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-t [&>*]:text-center">
                <td className="border border-gray-300 p-3 font-medium">
                  거래일
                </td>
                <td className="border border-gray-300 p-3">
                  {apiData.todayRecData.거래일 || "-"}
                </td>
              </tr>
              <tr className="border-t [&>*]:text-center">
                <td className="border border-gray-300 p-3 font-medium">
                  평균가
                </td>
                <td className="border border-gray-300 p-3">
                  {formatNumberWithoutDecimal(apiData.todayRecData.평균가) ||
                    "-"}
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
