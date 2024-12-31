import React from "react";

import {
  Table as ShadcnTable,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/shadcn";
import { formatNumberWithDecimal } from "@/hooks/useNumberFormatter";

interface DataRow {
  연도: number;
  국민총소득: number | undefined; // 데이터가 없을 수 있음
  경제성장률: number;
  상태: string;
}

const Table = ({ data }: { data: DataRow[] }) => {
  return (
    <div className="overflow-x-auto">
      <ShadcnTable className="min-w-full border border-gray-700 text-center text-[#070f26] dark:text-white">
        <TableHeader>
          <TableRow className="bg-[#F8F9FA] dark:bg-[rgb(15,25,50)] [&>*]:text-center">
            <TableHead className="border border-gray-700 px-3 py-2">
              연도
            </TableHead>
            <TableHead className="border border-gray-700 px-3 py-2">
              국민 총소득
            </TableHead>
            <TableHead className="border border-gray-700 px-3 py-2">
              경제 성장률
            </TableHead>
            <TableHead className="border border-gray-700 px-3 py-2">
              상태
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.연도}
              className="odd:bg-[#FFF] even:bg-[#F8F9FA] dark:odd:bg-[rgb(10,20,40)] dark:even:bg-[rgb(15,25,50)]"
            >
              <TableCell className="border border-gray-700 px-3 py-2">
                {row.연도}
              </TableCell>
              <TableCell className="border border-gray-700 px-3 py-2">
                {row.국민총소득
                  ? `${row.국민총소득.toLocaleString()}억원`
                  : "데이터 없음"}
              </TableCell>
              <TableCell className="border border-gray-700 px-3 py-2">
                {`${row.경제성장률.toFixed(2)}%`}
              </TableCell>
              <TableCell
                className={`border border-gray-700 px-3 py-2 ${
                  row.상태 === "긍정" ? "text-green-500" : "text-red-500"
                }`}
              >
                {row.상태}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </ShadcnTable>
    </div>
  );
};

export default Table;
