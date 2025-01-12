import React from "react";

import { Card } from "@/components/shadcn";
import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

import { ApiData } from "./page";

interface RecProps {
  apiData: ApiData;
}

function REC({ apiData }: RecProps) {
  return (
    <Card className="min-w-[432px] border-none bg-cardBackground-light p-cardPadding shadow-md dark:bg-cardBackground-dark">
      <div className="py-3 text-center text-lg font-semibold">오늘의 REC</div>
      <div className="mb-3 bg-blue-100 py-2 text-center text-sm font-medium text-blue-800">
        1REC = 1MWh (가중치에 따라 변동)
      </div>
      <table className="h-[148px] w-full border-collapse">
        <tbody>
          <tr className="border-t">
            <td className="border-0 border-r-1 border-t-1 border-gray-300 bg-tableHeader-light pb-[13px] pl-[17px] pr-[15px] pt-[14px] font-medium dark:bg-tableHeader-dark">
              거래일
            </td>
            <td className="border-0 border-t-1 border-gray-300 pb-[13px] pl-[17px] pr-[15px] pt-[14px]">
              {apiData.todayRecData.거래일 || "-"}
            </td>
            <td className="border-0 border-r-1 border-t-1 border-gray-300 bg-tableHeader-light pb-[13px] pl-[17px] pr-[15px] pt-[14px] font-medium dark:bg-tableHeader-dark">
              거래량
            </td>
            <td className="border-0 border-t-1 border-gray-300 pb-[13px] pl-[17px] pr-[15px] pt-[14px]">
              {formatNumberWithoutDecimal(apiData.todayRecData.거래량) || "-"}
            </td>
          </tr>
          <tr className="border-t">
            <td className="border-0 border-r-1 border-t-1 border-gray-300 bg-tableHeader-light pb-[13px] pl-[17px] pr-[15px] pt-[14px] font-medium dark:bg-tableHeader-dark">
              평균가
            </td>
            <td className="border-0 border-t-1 border-gray-300 pb-[13px] pl-[17px] pr-[15px] pt-[14px]">
              {formatNumberWithoutDecimal(apiData.todayRecData.평균가) || "-"}
            </td>
            <td className="border-0 border-r-1 border-t-1 border-gray-300 bg-tableHeader-light pb-[13px] pl-[17px] pr-[15px] pt-[14px] font-medium dark:bg-tableHeader-dark">
              최고가
            </td>
            <td className="border-0 border-t-1 border-gray-300 pb-[13px] pl-[17px] pr-[15px] pt-[14px]">
              {formatNumberWithoutDecimal(apiData.todayRecData.최고가) || "-"}
            </td>
          </tr>
          <tr className="border-t">
            <td className="border-0 border-b-1 border-r-1 border-t-1 border-gray-300 bg-tableHeader-light pb-[13px] pl-[17px] pr-[15px] pt-[14px] font-medium dark:bg-tableHeader-dark">
              최저가
            </td>
            <td className="border-0 border-b-1 border-t-1 border-gray-300 pb-[13px] pl-[17px] pr-[15px] pt-[14px]">
              {formatNumberWithoutDecimal(apiData.todayRecData.최저가) || "-"}
            </td>
            <td className="border-0 border-b-1 border-r-1 border-t-1 border-gray-300 bg-tableHeader-light pb-[13px] pl-[17px] pr-[15px] pt-[14px] font-medium dark:bg-tableHeader-dark">
              종가
            </td>
            <td className="border-0 border-b-1 border-t-1 border-gray-300 pb-[13px] pl-[17px] pr-[15px] pt-[14px]">
              {formatNumberWithoutDecimal(apiData.todayRecData.종가) || "-"}
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}

export default REC;
