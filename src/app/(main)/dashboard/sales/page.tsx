// "use client";

// import React, { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import * as XLSX from "xlsx";
// import Plot from "react-plotly.js";

// interface SalesData {
//   연도: number;
//   주택용: number;
//   일반용: number;
//   교육용: number;
//   산업용: number;
//   농사용: number;
//   가로등: number;
//   심야: number;
//   합계: number;
// }

// const SalesDashboard = () => {
//   const [data, setData] = useState<SalesData[]>([]);
//   const [selectedYear, setSelectedYear] = useState<number | null>(null);
//   const [kpi, setKpi] = useState({
//     highestCategory: "",
//     lowestCategory: "",
//     totalSales: "",
//   });
//   const [barChartData, setBarChartData] = useState<any[]>([]);
//   const [pieChartData, setPieChartData] = useState<any[]>([]);
//   const [lineChartData, setLineChartData] = useState<any[]>([]);

//   const categories = [
//     "주택용",
//     "일반용",
//     "교육용",
//     "산업용",
//     "농사용",
//     "가로등",
//     "심야",
//   ];

//   // 데이터 로드
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           "/assets/dashboards/HOME_발전·판매_판매금액.xlsx",
//         );
//         const arrayBuffer = await response.arrayBuffer();
//         const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
//           type: "array",
//         });
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const jsonData: SalesData[] = XLSX.utils.sheet_to_json(worksheet);
//         setData(jsonData);
//         setSelectedYear(jsonData[0].연도);
//       } catch (error) {
//         console.error("데이터 로드 중 오류 발생:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   // 데이터 분석 및 시각화
//   useEffect(() => {
//     if (data.length > 0 && selectedYear) {
//       const yearData = data.find((row) => row.연도 === selectedYear);

//       if (yearData) {
//         // 최고 및 최저 범주 계산
//         const maxCategory = categories.reduce(
//           (max, category) =>
//             yearData[category] > yearData[max] ? category : max,
//           categories[0],
//         );
//         const minCategory = categories.reduce(
//           (min, category) =>
//             yearData[category] < yearData[min] ? category : min,
//           categories[0],
//         );
//         setKpi({
//           highestCategory: `${maxCategory}: ${yearData[maxCategory].toLocaleString()} 원`,
//           lowestCategory: `${minCategory}: ${yearData[minCategory].toLocaleString()} 원`,
//           totalSales: `${yearData.합계.toLocaleString()} 원`,
//         });

//         // 막대 차트 데이터
//         const barData = [
//           {
//             x: categories,
//             y: categories.map((category) => yearData[category]),
//             type: "bar",
//             marker: { color: "#1f77b4" },
//           },
//         ];
//         setBarChartData(barData);

//         // 원형 차트 데이터
//         const pieData = [
//           {
//             labels: categories,
//             values: categories.map((category) => yearData[category]),
//             type: "pie",
//           },
//         ];
//         setPieChartData(pieData);
//       }

//       // 선 차트 데이터 (연도별 총 판매금액 추세)
//       const lineData = [
//         {
//           x: data.map((row) => row.연도),
//           y: data.map((row) => row.합계),
//           type: "scatter",
//           mode: "lines+markers",
//           marker: { color: "#e74c3c" },
//         },
//       ];
//       setLineChartData(lineData);
//     }
//   }, [data, selectedYear]);

//   return (
//     <div
//       style={{
//         padding: "20px",
//         fontFamily: "Arial, sans-serif",
//         backgroundColor: "#f9f9f9",
//         color: "#333",
//       }}
//     >
//       <h1 style={{ color: "#007aff" }}>판매금액 대시보드</h1>

//       {/* KPI 섹션 */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-around",
//           marginBottom: "20px",
//         }}
//       >
//         <div
//           style={{
//             backgroundColor: "#17a2b8",
//             padding: "20px",
//             borderRadius: "10px",
//             textAlign: "center",
//           }}
//         >
//           <h3>최고 판매금액 범주</h3>
//           <p style={{ fontSize: "24px" }}>{kpi.highestCategory}</p>
//         </div>
//         <div
//           style={{
//             backgroundColor: "#dc3545",
//             padding: "20px",
//             borderRadius: "10px",
//             textAlign: "center",
//           }}
//         >
//           <h3>최저 판매금액 범주</h3>
//           <p style={{ fontSize: "24px" }}>{kpi.lowestCategory}</p>
//         </div>
//         <div
//           style={{
//             backgroundColor: "#28a745",
//             padding: "20px",
//             borderRadius: "10px",
//             textAlign: "center",
//           }}
//         >
//           <h3>전체 판매금액</h3>
//           <p style={{ fontSize: "24px" }}>{kpi.totalSales}</p>
//         </div>
//       </div>

//       {/* 연도 선택 */}
//       <div style={{ marginBottom: "20px" }}>
//         <label style={{ marginRight: "10px" }}>연도 선택:</label>
//         <select
//           value={selectedYear || ""}
//           onChange={(e) => setSelectedYear(Number(e.target.value))}
//           style={{ padding: "10px", borderRadius: "5px" }}
//         >
//           {data.map((row) => (
//             <option key={row.연도} value={row.연도}>
//               {row.연도}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* 막대 차트 */}
//       <div style={{ marginBottom: "40px" }}>
//         <Plot
//           data={barChartData}
//           layout={{
//             title: `${selectedYear}년 범주별 판매금액`,
//             xaxis: { title: "범주" },
//             yaxis: { title: "판매금액 (원)" },
//           }}
//         />
//       </div>

//       {/* 원형 차트 */}
//       <div style={{ marginBottom: "40px" }}>
//         <Plot
//           data={pieChartData}
//           layout={{
//             title: `${selectedYear}년 범주별 판매금액 비율`,
//           }}
//         />
//       </div>

//       {/* 선 그래프 */}
//       <div style={{ marginBottom: "40px" }}>
//         <Plot
//           data={lineChartData}
//           layout={{
//             title: "연도별 총 판매금액 추세",
//             xaxis: { title: "연도" },
//             yaxis: { title: "총 판매금액 (원)" },
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default SalesDashboard;
import React from "react";

function page() {
  return <div>page</div>;
}

export default page;
