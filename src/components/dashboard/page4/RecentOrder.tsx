import React from "react";

interface RecentOrderRow {
  연도: number;
  경제성장률: number;
  상태: string;
}

const RecentOrders = ({ data }: { data: RecentOrderRow[] }) => {
  return (
    <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
      <h3 className="mb-4 text-xl font-bold text-white">최근 주요 데이터</h3>
      <table className="w-full text-left text-gray-400">
        <thead>
          <tr>
            <th>연도</th>
            <th>경제성장률</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.연도}>
              <td>{row.연도}</td>
              <td>{row.경제성장률.toFixed(2)}%</td>
              <td
                className={`${
                  row.상태 === "긍정" ? "text-green-400" : "text-red-400"
                }`}
              >
                {row.상태}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;
