import React from "react";

import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn";

interface TableRowData {
  연도: number;
  주택용: number;
  일반용: number;
  교육용: number;
  산업용: number;
  농사용: number;
  가로등: number;
  심야: number;
  합계: number;
}

interface TableProps {
  data: TableRowData[];
}

const Table = ({ data }: TableProps) => {
  if (data.length === 0)
    return <p className="text-center text-gray-500">데이터가 없습니다.</p>;

  const headers = Object.keys(data[0]) as (keyof TableRowData)[];

  return (
    <div className="overflow-x-auto">
      <ShadTable className="min-w-full border border-gray-700 text-left text-[#070f26] dark:text-white">
        {/* 테이블 헤더 */}
        <TableHeader>
          <TableRow className="bg-[#F8F9FA] dark:bg-[rgb(15,25,50)] [&>*]:text-left [&>*]:text-center">
            {headers.map((header) => (
              <TableHead
                key={header}
                className="border border-gray-700 px-3 py-2"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* 테이블 바디 */}
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              className="odd:bg-[#FFF] even:bg-[#F8F9FA] dark:odd:bg-[rgb(10,20,40)] dark:even:bg-[rgb(15,25,50)] [&>*]:text-center"
            >
              {headers.map((key) => (
                <TableCell
                  key={key}
                  className="border border-gray-700 px-3 py-2"
                >
                  {key === "연도"
                    ? row[key] // 연도일 때는 그대로 출력
                    : typeof row[key] === "number"
                      ? row[key].toLocaleString() // 숫자일 경우 toLocaleString 적용
                      : row[key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </ShadTable>
    </div>
  );
};

export default Table;
