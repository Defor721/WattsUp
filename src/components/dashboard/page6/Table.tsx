// Table.tsx
import React from "react";

interface DataRow {
  연도: number;
  주택용: number;
  일반용: number;
  교육용: number;
  산업용: number;
  농사용: number;
  가로등: number;
  심야: number;
  합계: number;
  [key: string]: string | number; // 인덱스 시그니처 추가
}

interface TableProps {
  data: DataRow[];
}

const Table: React.FC<TableProps> = ({ data }) => {
  if (data.length === 0) return <p>데이터가 없습니다.</p>;

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full rounded-lg bg-gray-800 shadow-md">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="border-b px-4 py-2 text-left text-sm font-bold text-gray-300"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-700">
              {headers.map((header) => (
                <td
                  key={header}
                  className="border-b px-4 py-2 text-sm text-gray-200"
                >
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
