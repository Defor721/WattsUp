import React from "react";

import {
  Table as ShadcnTable,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/shadcn";
import {
  formatNumberWithDecimal,
  formatNumberWithoutDecimal,
} from "@/hooks/useNumberFormatter";

interface EconomicData {
  연도: number;
  생산자물가지수: number;
  소비자물가지수: number;
  경상수지: number;
  자본수지: number;
  외환보유액: number;
  수출액: number;
  수입액: number;
  환율: number;
  실업률: number;
  콜금리: number;
}

function Table({
  data,
  currentYearData,
}: {
  data: EconomicData[];
  currentYearData: EconomicData;
}) {
  return (
    <div className="scrollbar-hide relative overflow-x-auto overflow-y-hidden whitespace-nowrap">
      <ShadcnTable className="min-w-full border border-gray-700 text-center text-[#070f26] dark:text-white">
        <TableHeader>
          <TableRow className="bg-[#F8F9FA] dark:bg-[rgb(15,25,50)] [&>*]:text-center">
            {Object.keys(currentYearData).map((key) => (
              <TableHead key={key} className="border border-gray-700 px-3 py-2">
                {key}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              className="odd:bg-[#FFF] even:bg-[#F8F9FA] dark:odd:bg-[rgb(10,20,40)] dark:even:bg-[rgb(15,25,50)]"
            >
              {Object.entries(row).map(([key, value], idx) => (
                <TableCell key={idx} className="border border-gray-700 p-3">
                  {key === "연도"
                    ? value
                    : typeof value === "number"
                      ? formatNumberWithDecimal(value)
                      : value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </ShadcnTable>
    </div>
  );
}

export default Table;
