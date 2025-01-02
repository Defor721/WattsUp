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

interface TableProps {
  data: { [key: string]: string | number }[];
}

const Table: React.FC<TableProps> = ({ data }) => {
  if (data.length === 0) return <p>데이터가 없습니다.</p>;

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">
      <ShadcnTable className="min-w-full border border-gray-700 text-center text-[#070f26] dark:text-white">
        <TableHeader>
          <TableRow className="bg-[#F8F9FA] dark:bg-[rgb(15,25,50)] [&>*]:text-center">
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
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              className="odd:bg-[#FFF] even:bg-[#F8F9FA] dark:odd:bg-[rgb(10,20,40)] dark:even:bg-[rgb(15,25,50)]"
            >
              {Object.entries(row).map(([key, value], idx) => (
                <TableCell key={idx} className="border border-gray-700 p-3">
                  {
                    key === "연도"
                      ? value // 연도는 그대로 표시
                      : typeof value === "number"
                        ? formatNumberWithoutDecimal(value) // 숫자는 포맷팅
                        : value // 나머지 값은 그대로 표시
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </ShadcnTable>
    </div>
  );
};

export default Table;
