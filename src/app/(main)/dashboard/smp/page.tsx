// "use client";

// import React, { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import * as XLSX from "xlsx";
// import axios from "axios";
// import { useRouter } from "next/navigation"; // Next.js 라우팅 훅 추가

// // Plotly를 dynamic import로 처리하여 SSR에서 제외
// const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// interface SMPData {
//   기간: string;
//   LNG: number;
//   유류: number;
//   무연탄: number;
//   유연탄: number;
//   원자력: number;
//   총계: number;
// }

// // 색상 정의
// const colors = {
//   background: "#1c1c1e",
//   cardBackground: "#f8f9fa",
//   text: "#2d2d2f",
//   primary: "#007aff",
//   success: "#2ecc71",
//   danger: "#e74c3c",
//   accent: "#ffd700",
// };

// // 대시보드 컴포넌트
// const SmpDashboard = () => {
//   const router = useRouter(); // useRouter 훅 사용
//   const [data, setData] = useState<SMPData[]>([]);
//   const [filteredData, setFilteredData] = useState<SMPData[]>([]);
//   const [selectedMonth, setSelectedMonth] = useState<string>("전체");
//   const [selectedFuel, setSelectedFuel] = useState<string>("전체");
//   const [kpi, setKpi] = useState({
//     LNG: 0,
//     유류: 0,
//     무연탄: 0,
//     유연탄: 0,
//     원자력: 0,
//   });

//   // 데이터를 로드하는 함수
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           "/assets/dashboards/HOME_전력거래_계통한계가격_연료원별SMP결정.xlsx",
//           {
//             responseType: "arraybuffer",
//           },
//         );
//         const workbook = XLSX.read(new Uint8Array(response.data), {
//           type: "array",
//         });
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];
//         const jsonData: SMPData[] = XLSX.utils.sheet_to_json(sheet);
//         setData(jsonData);
//         setFilteredData(jsonData);
//       } catch (error) {
//         console.error("데이터를 가져오는 중 오류 발생:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   // 데이터 필터링 및 KPI 업데이트
//   useEffect(() => {
//     let filtered = data;

//     if (selectedMonth !== "전체") {
//       filtered = filtered.filter((item) => item.기간.startsWith(selectedMonth));
//     }

//     setFilteredData(filtered);

//     // KPI 계산
//     const totalKPI = {
//       LNG: filtered.reduce((sum, item) => sum + item.LNG, 0),
//       유류: filtered.reduce((sum, item) => sum + item.유류, 0),
//       무연탄: filtered.reduce((sum, item) => sum + item.무연탄, 0),
//       유연탄: filtered.reduce((sum, item) => sum + item.유연탄, 0),
//       원자력: filtered.reduce((sum, item) => sum + item.원자력, 0),
//     };
//     setKpi(totalKPI);
//   }, [selectedMonth, data]);

//   // 데이터 다운로드 함수
//   const handleDownload = () => {
//     const worksheet = XLSX.utils.json_to_sheet(filteredData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "SMP Data");
//     XLSX.writeFile(workbook, "SMP_Data.xlsx");
//   };

//   // 그래프 데이터 생성
//   const graphData =
//     selectedFuel === "전체"
//       ? ["LNG", "유류", "무연탄", "유연탄", "원자력"].map((fuel) => ({
//           x: filteredData.map((d) => d.기간),
//           y: filteredData.map((d) => d[fuel as keyof SMPData]),
//           type: "scatter",
//           mode: "lines+markers",
//           name: fuel,
//         }))
//       : [
//           {
//             x: filteredData.map((d) => d.기간),
//             y: filteredData.map((d) => d[selectedFuel as keyof SMPData]),
//             type: "scatter",
//             mode: "lines+markers",
//             name: selectedFuel,
//           },
//         ];

//   return (
//     <div
//       style={{
//         backgroundColor: colors.background,
//         color: colors.text,
//         padding: "20px",
//         fontFamily: "Arial, sans-serif",
//       }}
//     >
//       <h1 style={{ color: colors.primary }}>계통한계가격(SMP) 대시보드</h1>

//       {/* 홈으로 돌아가기 버튼 */}
//       <button
//         onClick={() => router.push("/")}
//         style={{
//           padding: "10px 20px",
//           backgroundColor: colors.success,
//           color: "#ffffff",
//           marginBottom: "20px",
//         }}
//       >
//         홈으로 돌아가기
//       </button>

//       {/* 필터와 다운로드 버튼 */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           marginBottom: "20px",
//         }}
//       >
//         <div>
//           <label>기간 선택:</label>
//           <select
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(e.target.value)}
//             style={{ padding: "10px", margin: "10px 0" }}
//           >
//             <option value="전체">전체</option>
//             {[...new Set(data.map((d) => d.기간.split("/")[0]))].map((year) => (
//               <option key={year} value={year}>
//                 {year}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label>연료원 선택:</label>
//           <select
//             value={selectedFuel}
//             onChange={(e) => setSelectedFuel(e.target.value)}
//             style={{ padding: "10px", margin: "10px 0" }}
//           >
//             <option value="전체">전체</option>
//             {["LNG", "유류", "무연탄", "유연탄", "원자력"].map((fuel) => (
//               <option key={fuel} value={fuel}>
//                 {fuel}
//               </option>
//             ))}
//           </select>
//         </div>
//         <button
//           onClick={handleDownload}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: colors.primary,
//             color: "#ffffff",
//           }}
//         >
//           데이터 다운로드
//         </button>
//       </div>

//       {/* KPI 카드 */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-around",
//           marginBottom: "20px",
//         }}
//       >
//         {Object.keys(kpi).map((key) => (
//           <div
//             key={key}
//             style={{
//               backgroundColor: colors.cardBackground,
//               padding: "20px",
//               borderRadius: "8px",
//               width: "20%",
//             }}
//           >
//             <h3>{key} 총계</h3>
//             <p style={{ fontSize: "24px", color: colors.primary }}>
//               {kpi[key as keyof typeof kpi].toLocaleString()}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* 그래프 */}
//       <div>
//         <Plot
//           data={graphData}
//           layout={{
//             title: "연료원별 SMP 추이",
//             paper_bgcolor: colors.background,
//             font: { color: colors.text },
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default SmpDashboard;
import React from "react";

function page() {
  return <div>page</div>;
}

export default page;
