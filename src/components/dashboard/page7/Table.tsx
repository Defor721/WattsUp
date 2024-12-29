// Table.tsx
import React from "react";

interface TableProps {
  data: { [key: string]: string | number }[];
}

const Table: React.FC<TableProps> = ({ data }) => {
  if (data.length === 0) return <p>데이터가 없습니다.</p>;

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full rounded-lg bg-gray-800 text-white shadow-md">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="border-b px-4 py-2 text-left text-sm font-bold"
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
                <td key={header} className="border-b px-4 py-2 text-sm">
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
