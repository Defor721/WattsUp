import React, { useState } from "react";

interface RecentOrdersProps {
  data: { 기간: string; 연료단가_원자력: number; 상태: string }[];
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ data }) => {
  const [search, setSearch] = useState("");

  const filteredData = data.filter((row) =>
    row.기간.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-full rounded-lg bg-gray-800 p-4 shadow-lg">
      <h2 className="mb-4 text-lg font-bold text-white">최근 데이터</h2>
      <input
        type="text"
        placeholder="검색 (기간)"
        className="mb-4 w-full rounded-md border border-gray-600 bg-gray-900 p-2 text-white focus:outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="w-full text-white">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-2">기간</th>
            <th className="p-2">연료단가 (원자력)</th>
            <th className="p-2">상태</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-700">
              <td className="p-2">{row.기간}</td>
              <td className="p-2">{row.연료단가_원자력.toLocaleString()}</td>
              <td className="p-2">{row.상태}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;
