"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

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

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get("/api/crawl", {
        timeout: 10000, // 10초 타임아웃 설정
      });
      setApiData(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.code === "ECONNABORTED") {
          setError("요청 시간이 초과되었습니다. 다시 시도해주세요.");
        } else {
          setError(
            "데이터를 불러오는데 실패했습니다. 나중에 다시 시도해주세요.",
          );
        }
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
        <button
          onClick={fetchData}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!apiData) {
    return null; // 데이터가 없을 경우 안전하게 반환
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-8 text-center text-3xl font-bold">오늘의 전력정보</h1>
      <div className="flex justify-center gap-7">
        <Card className="h-[300px] w-[488px] bg-white p-4 text-mainColor shadow-md">
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
                  {apiData.todaySmpData.거래일 || "-"}
                </td>
              </tr>
              <tr className="border-t">
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  최고가
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {apiData.todaySmpData.최고가 || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
        <Card className="h-[300px] w-[488px] bg-white p-4 text-subColor shadow-md">
          <div className="py-3 text-center text-lg font-semibold">
            오늘의 REC
          </div>
          <div className="bg-blue-100 py-2 text-center text-sm font-medium text-blue-800">
            1REC = 1MWh (가중치에 따라 변동)
          </div>
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-t">
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  거래일
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {apiData.todayRecData.거래일 || "-"}
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
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

export default TodayValue;
