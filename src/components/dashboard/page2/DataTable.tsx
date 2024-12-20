import React from "react";

interface Column {
  key: string;
  title: string;
}

interface DataTableProps {
  data: Record<string, string | number>[]; // 데이터는 유연하게 처리
  columns: Column[]; // 추가: 열 정의
}

const DataTable: React.FC<DataTableProps> = ({ data, columns }) => {
  return (
    <div className="overflow-x-auto rounded-lg bg-gray-800 shadow-md">
      <table className="min-w-full text-left text-white">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-6 py-3 text-sm font-medium">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-gray-700 hover:bg-gray-700"
            >
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 text-sm">
                  {row[column.key]?.toString() || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
