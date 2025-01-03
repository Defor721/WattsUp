"use client";

import React from "react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/shadcn"; // shadcn/ui 컴포넌트 import

interface Column {
  label: string; // 컬럼명
  key: string; // 데이터 키
}

interface CustomTableProps {
  columns: Column[]; // 테이블 헤더 정보
  data: Record<string, string | number>[]; // 테이블 데이터
}

function CustomTable({ columns, data }: CustomTableProps) {
  if (!data) return null;

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full border border-gray-700 text-center text-[#070f26] dark:text-white">
        {/* 테이블 헤더 */}
        <TableHeader>
          <TableRow className="bg-[#F8F9FA] dark:bg-[rgb(15,25,50)] [&>*]:text-center">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className="border border-gray-700 px-3 py-2"
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        {/* 테이블 본문 */}
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className="odd:bg-[#FFF] even:bg-[#F8F9FA] dark:odd:bg-[rgb(10,20,40)] dark:even:bg-[rgb(15,25,50)]"
            >
              {columns.map((col) => (
                <TableCell key={col.key} className="border border-gray-700 p-3">
                  {row[col.key] !== undefined ? row[col.key] : "-"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default CustomTable;
