import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn";

interface TableProps {
  data: {
    연도: number;
    수력: number;
    원자력: number;
    신재생: number;
    총발전량: number;
  }[];
}

const PowerGenerationTable = ({ data }: TableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full border border-gray-700 text-left text-[#070f26] dark:text-white">
        {/* 테이블 헤더 */}
        <TableHeader>
          <TableRow className="bg-tableHeader-light dark:bg-tableHeader-dark [&>*]:text-center">
            <TableHead className="border border-gray-700 px-3 py-2">
              연도
            </TableHead>
            <TableHead className="border border-gray-700 px-3 py-2">
              수력발전
            </TableHead>
            <TableHead className="border border-gray-700 px-3 py-2">
              원자력
            </TableHead>
            <TableHead className="border border-gray-700 px-3 py-2">
              신재생
            </TableHead>
            <TableHead className="border border-gray-700 px-3 py-2">
              총발전량
            </TableHead>
          </TableRow>
        </TableHeader>

        {/* 테이블 바디 */}
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.연도}
              className="bg-transparent [&>*]:text-center"
            >
              <TableCell className="border border-gray-700 px-3 py-2">
                {row.연도}
              </TableCell>
              <TableCell className="border border-gray-700 px-3 py-2">
                {row.수력.toLocaleString()}
              </TableCell>
              <TableCell className="border border-gray-700 px-3 py-2">
                {row.원자력.toLocaleString()}
              </TableCell>
              <TableCell className="border border-gray-700 px-3 py-2">
                {row.신재생.toLocaleString()}
              </TableCell>
              <TableCell className="border border-gray-700 px-3 py-2">
                {row.총발전량.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PowerGenerationTable;
