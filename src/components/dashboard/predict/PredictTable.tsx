import React from "react";

interface IData {
  date: string;
  data: Array<Record<string, string>>;
  amgo?: number | string; // 발전량 예측값 추가
}

interface PredictTableProps {
  tableData: IData[];
}

const PredictTable: React.FC<PredictTableProps> = ({ tableData }) => {
  if (!tableData || tableData.length === 0) {
    return <p className="text-center text-gray-400">데이터가 없습니다.</p>;
  }

  // 모든 데이터 키 및 "발전량 예측값" 포함d
  const headers = [
    ...Object.keys(tableData[0].data[0]), // 데이터의 키
    "발전량 예측값 (amgo)", // 추가 항목
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-700 text-center">
        <thead className="bg-[rgb(15,25,50)] text-gray-300">
          <tr>
            <th className="border border-gray-700 px-3 py-2">날짜</th>
            {headers.map((header) => {
              const match = header.match(/^(.*?)(\((.*?)\))?$/);
              const title = match?.[1] || header; // 제목
              const unit = match?.[3] || ""; // 단위

              return (
                <th key={header} className="border border-gray-700 px-3 py-2">
                  <div className="md:text-sm lg:text-base">{title}</div>
                  {unit && (
                    <div className="text-sm text-gray-500">({unit})</div>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr
              key={row.date}
              className="odd:bg-[rgb(10,20,40)] even:bg-[rgb(15,25,50)]"
            >
              <td className="border border-gray-700 px-3 py-3 text-gray-200">
                {`${row.date.slice(0, 4)}-${row.date.slice(4, 6)}-${row.date.slice(6)}`}
              </td>
              {headers.map((header) => (
                <td
                  key={`${row.date}-${header}`}
                  className="px-4 py-3 text-gray-200 lg:border lg:border-gray-700"
                >
                  {header === "발전량 예측값 (amgo)"
                    ? row.amgo || "-"
                    : row.data[0][header] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PredictTable;
