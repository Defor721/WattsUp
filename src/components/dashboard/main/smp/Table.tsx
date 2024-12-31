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
    기간: string;
    LNG: number;
    유류: number;
    무연탄: number;
    유연탄: number;
    원자력: number;
    총계: number;
  }[];
}

const SMPTable: React.FC<TableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full border border-gray-700 text-center text-[#070f26] dark:text-white">
        {/* 테이블 헤더 */}
        <TableHeader>
          <TableRow className="bg-[#F8F9FA] dark:bg-[rgb(15,25,50)] [&>*]:text-center">
            <TableHead className="border border-gray-700 px-3 py-2">
              기간
            </TableHead>
            <TableHead className="border border-gray-700 px-3 py-2">
              LNG
            </TableHead>
            <TableHead className="border border-gray-700 px-3 py-2">
              유류
            </TableHead>
            <TableHead className="border border-gray-700 px-3 py-2">
              무연탄
            </TableHead>
            <TableHead className="border border-gray-700 px-3 py-2">
              유연탄
            </TableHead>
            <TableHead className="border border-gray-700 px-3 py-2">
              원자력
            </TableHead>
            <TableHead className="border border-gray-700 px-3 py-2">
              총계
            </TableHead>
          </TableRow>
        </TableHeader>

        {/* 테이블 바디 */}
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              className="odd:bg-[#FFF] even:bg-[#F8F9FA] dark:odd:bg-[rgb(10,20,40)] dark:even:bg-[rgb(15,25,50)]"
            >
              <TableCell className="border border-gray-700 p-3">
                {row.기간}
              </TableCell>
              <TableCell className="border border-gray-700 p-3">
                {row.LNG.toLocaleString()}
              </TableCell>
              <TableCell className="border border-gray-700 p-3">
                {row.유류.toLocaleString()}
              </TableCell>
              <TableCell className="border border-gray-700 p-3">
                {row.무연탄.toLocaleString()}
              </TableCell>
              <TableCell className="border border-gray-700 p-3">
                {row.유연탄.toLocaleString()}
              </TableCell>
              <TableCell className="border border-gray-700 p-3">
                {row.원자력.toLocaleString()}
              </TableCell>
              <TableCell className="border border-gray-700 p-3">
                {row.총계.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SMPTable;
