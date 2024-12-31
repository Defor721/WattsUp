import React from "react";

interface TableProps {
  data: { [key: string]: string | number }[];
}

const Table: React.FC<TableProps> = ({ data }) => {
  if (!data.length) return <p className="text-gray-400">데이터가 없습니다.</p>;

  const headers = Object.keys(data[0]);

  return (
    <table className="min-w-full table-auto text-sm text-gray-300">
      <thead className="bg-gray-700">
        <tr>
          {headers.map((header) => (
            <th key={header} className="px-4 py-2 text-left">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr
            key={index}
            className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}
          >
            {headers.map((header) => (
              <td key={header} className="px-4 py-2">
                {typeof row[header] === "number"
                  ? row[header].toLocaleString()
                  : row[header]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
