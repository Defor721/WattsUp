import React from "react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Card,
} from "@/components/shadcn"; // shadcn/ui 컴포넌트 import

interface IData {
  date: string;
  windSpeed: string;
  temperature: string;
  precipitation: string;
  amgo: number | string;
}

interface PredictTableProps {
  tableData: IData[];
  selectedRegion: string;
}

function PredictTable({ tableData, selectedRegion }: PredictTableProps) {
  if (!tableData) return null;

  return (
    <Card className="border-none bg-cardBackground-light p-5 dark:bg-cardBackground-dark">
      <h4 className="my-3 scroll-m-20 text-center text-xl font-semibold tracking-tight">
        {selectedRegion} 테이블
      </h4>
      <div className="overflow-x-auto">
        <Table className="min-w-full border border-gray-700 text-center">
          {/* 테이블 헤더 */}
          <TableHeader className="bg-tableHeader-light dark:bg-tableHeader-dark">
            <TableRow className="bg-transparent [&>*]:text-center">
              <TableHead className="border border-gray-700 px-3 py-2">
                날짜
              </TableHead>
              <TableHead className="border border-gray-700 px-3 py-2">
                평균 풍속 (m/s)
              </TableHead>
              <TableHead className="border border-gray-700 px-3 py-2">
                평균 기온 (°C)
              </TableHead>
              <TableHead className="border border-gray-700 px-3 py-2">
                강수량 (mm)
              </TableHead>
              <TableHead className="border border-gray-700 px-3 py-2">
                발전량 예측값(amgo)
              </TableHead>
            </TableRow>
          </TableHeader>
          {/* 테이블 본문 */}
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.date} className="bg-transparent">
                <TableCell className="border border-gray-700 p-3">
                  {row.date}
                </TableCell>
                <TableCell className="border border-gray-700 p-3">
                  {row.windSpeed}
                </TableCell>
                <TableCell className="border border-gray-700 p-3">
                  {row.temperature}
                </TableCell>
                <TableCell className="border border-gray-700 p-3">
                  {row.precipitation}
                </TableCell>
                <TableCell className="border border-gray-700 p-3">
                  {row.amgo !== "-" ? row.amgo : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export default PredictTable;
