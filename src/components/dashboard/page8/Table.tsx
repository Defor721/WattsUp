import React from "react";

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

const Table: React.FC<TableProps> = ({ data }) => {
  return (
    <table className="w-full table-auto border-collapse border border-gray-500 text-left text-white">
      <thead>
        <tr>
          <th className="border border-gray-600 p-2">기간</th>
          <th className="border border-gray-600 p-2">LNG</th>
          <th className="border border-gray-600 p-2">유류</th>
          <th className="border border-gray-600 p-2">무연탄</th>
          <th className="border border-gray-600 p-2">유연탄</th>
          <th className="border border-gray-600 p-2">원자력</th>
          <th className="border border-gray-600 p-2">총계</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index} className="border-t border-gray-700">
            <td className="border border-gray-600 p-2">{row.기간}</td>
            <td className="border border-gray-600 p-2">
              {row.LNG.toLocaleString()}
            </td>
            <td className="border border-gray-600 p-2">
              {row.유류.toLocaleString()}
            </td>
            <td className="border border-gray-600 p-2">
              {row.무연탄.toLocaleString()}
            </td>
            <td className="border border-gray-600 p-2">
              {row.유연탄.toLocaleString()}
            </td>
            <td className="border border-gray-600 p-2">
              {row.원자력.toLocaleString()}
            </td>
            <td className="border border-gray-600 p-2">
              {row.총계.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
