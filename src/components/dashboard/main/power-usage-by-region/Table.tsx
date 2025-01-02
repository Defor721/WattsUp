import React from "react";

import {
  Table as ShadcnTable,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/shadcn";

interface TableProps {
  data: { [key: string]: string | number }[];
}

const Table: React.FC<TableProps> = ({ data }) => {
  if (!data.length) return <p className="text-gray-400">데이터가 없습니다.</p>;

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
              {headers.map((header, idx) => (
                <TableCell key={idx} className="border border-gray-700 p-3">
                  {header === "연도"
                    ? row[header]
                    : typeof row[header] === "number"
                      ? row[header].toLocaleString()
                      : row[header]}
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
