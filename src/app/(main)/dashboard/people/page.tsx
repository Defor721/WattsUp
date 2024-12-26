// "use client";

// import React, { useState, useEffect } from "react";
// import * as XLSX from "xlsx";
// import {
//   BatteryCharging,
//   TrendingUp,
//   TrendingDown,
//   Activity,
// } from "lucide-react";

// import LineChart from "@/components/dashboard/page4/LineChart";
// import BarChart from "@/components/dashboard/page4/BarChart";
// import KPICard from "@/components/dashboard/page3/KPICard";
// import RecentOrders from "@/components/dashboard/page4/RecentOrder";
// import UsersByCountry from "@/components/dashboard/page4/UserByCountry";

// interface DataRow {
//   연도: number;
//   경제성장률: number;
//   국내총생산: number;
//   국민총소득: number;
//   국민총소득_1인당: number;
//   총저축률: number;
//   국내총투자율: number;
// }

// const NationalAccountDashboard = () => {
//   const [data, setData] = useState<DataRow[]>([]);
//   const [selectedYear, setSelectedYear] = useState<number>(2023);
//   const [currentKPI, setCurrentKPI] = useState<DataRow | null>(null);

//   // 데이터 불러오기
//   useEffect(() => {
//     const loadData = async () => {
//       const response = await fetch(
//         "/assets/dashboards/HOME_Main indicators_National accounts.xlsx",
//       );
//       const arrayBuffer = await response.arrayBuffer();
//       const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
//         type: "array",
//       });
//       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//       const jsonData: DataRow[] = XLSX.utils
//         .sheet_to_json(worksheet)
//         .map((row: any) => ({
//           연도: Number(row["연도"]),
//           경제성장률: Number(row["경제성장률(%)"]),
//           국내총생산: Number(row["국내총생산(10억원)"]),
//           국민총소득: Number(row["국민총소득(10억원)"]),
//           국민총소득_1인당: Number(row["1인당 국민총소득(US$)"]),
//           총저축률: Number(row["총저축률(%)"]),
//           국내총투자율: Number(row["국내총투자율(%)"]),
//         }));
//       setData(jsonData);
//       setSelectedYear(jsonData[0]?.연도 || 2023); // 최신 연도로 초기화
//       setCurrentKPI(jsonData[0]);
//     };

//     loadData();
//   }, []);

//   // 선택한 연도의 KPI 데이터 업데이트
//   useEffect(() => {
//     const yearData = data.find((row) => row.연도 === selectedYear);
//     setCurrentKPI(yearData || null);
//   }, [selectedYear, data]);

//   const handleDownload = () => {
//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "National Accounts Data");
//     XLSX.writeFile(workbook, "NationalAccountDashboardData.xlsx");
//   };

//   const kpiConfig = {
//     경제성장률: {
//       icon: <TrendingUp size={24} />,
//       backgroundColor: "#34D399",
//       unit: "%",
//     },
//     국내총생산: {
//       icon: <BatteryCharging size={24} />,
//       backgroundColor: "#60A5FA",
//       unit: "억원",
//     },
//     국민총소득: {
//       icon: <Activity size={24} />,
//       backgroundColor: "#FBBF24",
//       unit: "억원",
//     },
//     국민총소득_1인당: {
//       icon: <TrendingUp size={24} />,
//       backgroundColor: "#4ADE80",
//       unit: "US$",
//     },
//     총저축률: {
//       icon: <TrendingDown size={24} />,
//       backgroundColor: "#F87171",
//       unit: "%",
//     },
//     국내총투자율: {
//       icon: <Activity size={24} />,
//       backgroundColor: "#93C5FD",
//       unit: "%",
//     },
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 p-6 text-white">
//       <h1 className="mb-6 text-center text-4xl font-bold">국민계정 대시보드</h1>

//       {/* 연도 선택 및 다운로드 */}
//       <div className="mb-6 flex items-center justify-between">
//         <select
//           value={selectedYear}
//           onChange={(e) => setSelectedYear(Number(e.target.value))}
//           className="rounded-md border border-gray-300 bg-gray-800 p-2 text-white"
//         >
//           {data.map((row) => (
//             <option key={row.연도} value={row.연도}>
//               {row.연도}
//             </option>
//           ))}
//         </select>
//         <button
//           onClick={handleDownload}
//           className="rounded-md bg-blue-600 px-4 py-2 hover:bg-blue-700"
//         >
//           데이터 다운로드
//         </button>
//       </div>

//       {/* KPI 카드 */}
//       {currentKPI && (
//         <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
//           {Object.entries(currentKPI).map(([key, value]) => {
//             if (key === "연도") return null;
//             const config = kpiConfig[key as keyof typeof kpiConfig];
//             return (
//               <KPICard
//                 key={key}
//                 title={key}
//                 value={`${value.toLocaleString()} ${config.unit}`}
//                 icon={config.icon}
//                 backgroundColor={config.backgroundColor}
//                 iconColor="#1E3A8A"
//               />
//             );
//           })}
//         </div>
//       )}

//       {/* 차트 섹션 */}
//       <div className="grid gap-6 lg:grid-cols-2">
//         <BarChart
//           data={{
//             labels: data.map((row) => row.연도),
//             datasets: [
//               {
//                 label: "경제성장률",
//                 data: data.map((row) => row.경제성장률),
//                 backgroundColor: "#4ADE80",
//               },
//             ],
//           }}
//           title="경제성장률 데이터"
//         />
//         <LineChart
//           data={{
//             labels: data.map((row) => row.연도),
//             datasets: [
//               {
//                 label: "국내총생산",
//                 data: data.map((row) => row.국내총생산),
//                 borderColor: "#60A5FA",
//                 backgroundColor: "rgba(96, 165, 250, 0.2)",
//                 fill: true,
//               },
//             ],
//           }}
//           title="국내총생산 추이"
//         />
//       </div>

//       {/* 최근 데이터 및 국가별 사용자 */}
//       <div className="mt-6 grid gap-6 lg:grid-cols-2">
//         <RecentOrders
//           data={data.map((row) => ({
//             연도: row.연도,
//             경제성장률: row.경제성장률,
//             상태: row.경제성장률 > 0 ? "긍정" : "부정",
//           }))}
//         />
//         <UsersByCountry
//           data={data.map((row) => ({
//             label: `${row.연도}년`,
//             value: row.국민총소득,
//           }))}
//         />
//       </div>
//     </div>
//   );
// };

// export default NationalAccountDashboard;
import React from "react";

function page() {
  return <div>page</div>;
}

export default page;
