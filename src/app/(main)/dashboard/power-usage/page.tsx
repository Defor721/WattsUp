// "use client";

// import React, { useState, useEffect } from "react";
// import dynamic from "next/dynamic";
// import * as XLSX from "xlsx";
// import Plot from "react-plotly.js";
// import Link from "next/link";

// interface PowerUsageData {
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

// const PowerUsageDashboard = () => {
//   const [data, setData] = useState<PowerUsageData[]>([]);
//   const [selectedYear, setSelectedYear] = useState<number | null>(null);
//   const [filteredData, setFilteredData] = useState<PowerUsageData | null>(null);

//   // 데이터 로드
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           "/assets/dashboards/HOME_CUSTOMR_CONTRACT.xlsx",
//         );
//         const arrayBuffer = await response.arrayBuffer();
//         const workbook = XLSX.read(arrayBuffer, { type: "array" });
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const jsonData: PowerUsageData[] = XLSX.utils.sheet_to_json(worksheet);
//         setData(jsonData);

//         // 최신 연도로 기본값 설정
//         const latestYear = Math.max(...jsonData.map((item) => item.연도));
//         setSelectedYear(latestYear);
//       } catch (error) {
//         console.error("Error loading data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   // 선택된 연도에 따라 데이터 필터링
//   useEffect(() => {
//     if (selectedYear !== null) {
//       const filtered = data.find((item) => item.연도 === selectedYear);
//       setFilteredData(filtered || null);
//     }
//   }, [selectedYear, data]);

//   // 데이터 다운로드
//   const handleDownload = () => {
//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "전력사용량");
//     XLSX.writeFile(workbook, "전력사용량_데이터.xlsx");
//   };

//   if (!filteredData) {
//     return <p>Loading...</p>;
//   }

//   // Plotly 색상 팔레트
//   const colorPalette = [
//     "#636EFA",
//     "#EF553B",
//     "#00CC96",
//     "#AB63FA",
//     "#FFA15A",
//     "#19D3F3",
//     "#FF6692",
//   ];

//   // 연도별 추세 (라인 차트)
//   const lineChartData = [
//     {
//       x: data.map((item) => item.연도),
//       y: data.map((item) => item.주택용),
//       name: "주택용",
//       type: "scatter",
//       mode: "lines+markers",
//       marker: { color: colorPalette[0] },
//     },
//     {
//       x: data.map((item) => item.연도),
//       y: data.map((item) => item.일반용),
//       name: "일반용",
//       type: "scatter",
//       mode: "lines+markers",
//       marker: { color: colorPalette[1] },
//     },
//     {
//       x: data.map((item) => item.연도),
//       y: data.map((item) => item.산업용),
//       name: "산업용",
//       type: "scatter",
//       mode: "lines+markers",
//       marker: { color: colorPalette[2] },
//     },
//   ];

//   // 선택된 연도별 사용량 비율 (파이 차트)
//   const pieChartData = [
//     {
//       labels: [
//         "주택용",
//         "일반용",
//         "교육용",
//         "산업용",
//         "농사용",
//         "가로등",
//         "심야",
//       ],
//       values: [
//         filteredData.주택용,
//         filteredData.일반용,
//         filteredData.교육용,
//         filteredData.산업용,
//         filteredData.농사용,
//         filteredData.가로등,
//         filteredData.심야,
//       ],
//       type: "pie",
//       marker: { colors: colorPalette },
//     },
//   ];

//   // 주요 구분 비교 (스택형 막대 차트)
//   const barChartData = [
//     {
//       x: data.map((item) => item.연도),
//       y: data.map((item) => item.주택용),
//       name: "주택용",
//       type: "bar",
//       marker: { color: colorPalette[0] },
//     },
//     {
//       x: data.map((item) => item.연도),
//       y: data.map((item) => item.일반용),
//       name: "일반용",
//       type: "bar",
//       marker: { color: colorPalette[1] },
//     },
//     {
//       x: data.map((item) => item.연도),
//       y: data.map((item) => item.산업용),
//       name: "산업용",
//       type: "bar",
//       marker: { color: colorPalette[2] },
//     },
//   ];

//   return (
//     <div
//       style={{
//         padding: "20px",
//         fontFamily: "Arial, sans-serif",
//         color: "#ffffff",
//         backgroundColor: "#1c1c1e",
//       }}
//     >
//       {/* 홈으로 돌아가기 */}
//       <Link
//         href="/dashboard"
//         style={{
//           padding: "10px 20px",
//           backgroundColor: "#007aff",
//           color: "#ffffff",
//           textDecoration: "none",
//           borderRadius: "8px",
//         }}
//       >
//         홈으로 돌아가기
//       </Link>

//       <h1 style={{ marginTop: "20px", color: "#007aff" }}>
//         전력 사용량 대시보드
//       </h1>

//       {/* 카드 */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           marginBottom: "20px",
//         }}
//       >
//         <div
//           style={{
//             padding: "20px",
//             backgroundColor: "#282c34",
//             borderRadius: "8px",
//             width: "30%",
//           }}
//         >
//           <h3>총 전력 사용량 (MWh)</h3>
//           <p style={{ fontSize: "24px", color: "#00CC96" }}>
//             {filteredData.합계.toLocaleString()} MWh
//           </p>
//         </div>
//         <div
//           style={{
//             padding: "20px",
//             backgroundColor: "#282c34",
//             borderRadius: "8px",
//             width: "30%",
//           }}
//         >
//           <h3>주택용 사용량 (MWh)</h3>
//           <p style={{ fontSize: "24px", color: "#636EFA" }}>
//             {filteredData.주택용.toLocaleString()} MWh
//           </p>
//         </div>
//         <div
//           style={{
//             padding: "20px",
//             backgroundColor: "#282c34",
//             borderRadius: "8px",
//             width: "30%",
//           }}
//         >
//           <h3>산업용 사용량 (MWh)</h3>
//           <p style={{ fontSize: "24px", color: "#EF553B" }}>
//             {filteredData.산업용.toLocaleString()} MWh
//           </p>
//         </div>
//       </div>

//       {/* 그래프 */}
//       <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
//         <div
//           style={{
//             flex: 1,
//             backgroundColor: "#282c34",
//             borderRadius: "8px",
//             padding: "10px",
//           }}
//         >
//           <h3>연도별 전력 사용량 추세</h3>
//           <Plot
//             data={lineChartData}
//             layout={{
//               title: "",
//               paper_bgcolor: "#282c34",
//               font: { color: "#ffffff" },
//             }}
//           />
//         </div>
//         <div
//           style={{
//             flex: 1,
//             backgroundColor: "#282c34",
//             borderRadius: "8px",
//             padding: "10px",
//           }}
//         >
//           <h3>{selectedYear}년 사용량 비율</h3>
//           <Plot
//             data={pieChartData}
//             layout={{
//               title: "",
//               paper_bgcolor: "#282c34",
//               font: { color: "#ffffff" },
//             }}
//           />
//         </div>
//       </div>

//       <div
//         style={{
//           backgroundColor: "#282c34",
//           borderRadius: "8px",
//           padding: "10px",
//         }}
//       >
//         <h3>연도별 주요 구분 비교</h3>
//         <Plot
//           data={barChartData}
//           layout={{
//             barmode: "stack",
//             paper_bgcolor: "#282c34",
//             font: { color: "#ffffff" },
//           }}
//         />
//       </div>

//       {/* 데이터 다운로드 버튼 */}
//       <div style={{ marginTop: "20px" }}>
//         <button
//           onClick={handleDownload}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#007aff",
//             color: "#ffffff",
//             border: "none",
//             borderRadius: "8px",
//           }}
//         >
//           데이터 다운로드
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PowerUsageDashboard;
import React from "react";

function page() {
  return <div>page</div>;
}

export default page;
