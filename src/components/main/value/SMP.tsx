import React from "react";

import { Card } from "@/components/shadcn";

import { ApiData } from "./page";

interface SmpProps {
  apiData: ApiData;
}

function SMP({ apiData }: SmpProps) {
  return (
    <Card className="min-w-[432px] border-none bg-cardBackground-light p-cardPadding dark:bg-cardBackground-dark">
      <div className="py-3 text-center text-lg font-semibold">오늘의 SMP</div>
      <div className="mb-3 mt-6 flex justify-end text-xs text-gray-500 dark:text-gray-300">
        (단위: 원/kWh)
      </div>
      <table className="h-[148px] w-full border-collapse">
        <tbody>
          <tr className="border-t">
            <td className="w-[133px] border-0 border-r-1 border-t-1 border-gray-300 bg-tableHeader-light pb-[6px] pl-[17px] pr-[15px] pt-[8px] font-medium dark:bg-tableHeader-dark">
              거래일
            </td>
            <td className="border-0 border-t-1 border-gray-300 pb-[6px] pl-[23px] pr-[15px] pt-[8px]">
              {apiData.todaySmpData.거래일 || "-"}
            </td>
          </tr>
          <tr className="border-t">
            <td className="w-[133px] border-0 border-r-1 border-t-1 border-gray-300 bg-tableHeader-light pb-[6px] pl-[17px] pr-[15px] pt-[8px] font-medium dark:bg-tableHeader-dark">
              최고가
            </td>
            <td className="border-0 border-t-1 border-gray-300 pb-[6px] pl-[23px] pr-[15px] pt-[8px]">
              {apiData.todaySmpData.최고가 || "-"}
            </td>
          </tr>
          <tr className="border-t">
            <td className="w-[133px] border-0 border-r-1 border-t-1 border-gray-300 bg-tableHeader-light pb-[6px] pl-[17px] pr-[15px] pt-[8px] font-medium dark:bg-tableHeader-dark">
              최소가
            </td>
            <td className="border-0 border-t-1 border-gray-300 pb-[6px] pl-[23px] pr-[15px] pt-[8px]">
              {apiData.todaySmpData.최소가 || "-"}
            </td>
          </tr>
          <tr className="border-t">
            <td className="w-[133px] border-0 border-b-1 border-r-1 border-t-1 border-gray-300 bg-tableHeader-light pb-[6px] pl-[17px] pr-[15px] pt-[8px] font-medium dark:bg-tableHeader-dark">
              평균가
            </td>
            <td className="border-0 border-b-1 border-t-1 border-gray-300 pb-[6px] pl-[23px] pr-[15px] pt-[8px]">
              {apiData.todaySmpData.평균가 || "-"}
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}

export default SMP;
