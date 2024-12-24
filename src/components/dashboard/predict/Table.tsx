import React from "react";

interface IData {
  date: string;
  windSpeed: string;
  temperature: string;
  precipitation: string;
  amgo: number | string;
}

interface PredictTableProps {
  tableData: IData[];
  selectedRegion: string;
}

function PredictTable({ tableData, selectedRegion }: PredictTableProps) {
  if (!tableData) return <div>로딩중...</div>;

  return (
    <div className="mt-5">
      <h4 className="my-2 scroll-m-20 text-center text-xl font-semibold tracking-tight">
        {selectedRegion} 테이블
      </h4>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-700 text-center">
          <thead className="bg-[rgb(15,25,50)] text-gray-300">
            <tr>
              <th className="border border-gray-700 px-3 py-2">날짜</th>
              <th className="border border-gray-700 px-3 py-2">
                평균 풍속 (m/s)
              </th>
              <th className="border border-gray-700 px-3 py-2">
                평균 기온 (°C)
              </th>
              <th className="border border-gray-700 px-3 py-2">강수량 (mm)</th>
              <th className="border border-gray-700 px-3 py-2">
                발전량 예측값
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr
                key={row.date}
                className="odd:bg-[rgb(10,20,40)] even:bg-[rgb(15,25,50)]"
              >
                <td className="border border-gray-700 px-3 py-3 text-gray-200">
                  {row.date}
                </td>
                <td className="border border-gray-700 px-3 py-3 text-gray-200">
                  {row.windSpeed}
                </td>
                <td className="border border-gray-700 px-3 py-3 text-gray-200">
                  {row.temperature}
                </td>
                <td className="border border-gray-700 px-3 py-3 text-gray-200">
                  {row.precipitation}
                </td>
                <td className="border border-gray-700 px-3 py-3 text-gray-200">
                  {row.amgo !== "-" ? row.amgo : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PredictTable;
