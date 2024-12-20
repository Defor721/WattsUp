import React from "react";
import { Bar } from "react-chartjs-2";

interface BarChartProps {
  data: {
    year: string;
    석탄: number;
    석유: number;
    수력: number;
    원자력: number;
  }[];
  title: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  const chartData = {
    labels: data.map((item) => item.year),
    datasets: [
      {
        label: "석탄",
        data: data.map((item) => item["석탄"]),
        backgroundColor: "#3B82F6",
      },
      {
        label: "석유",
        data: data.map((item) => item["석유"]),
        backgroundColor: "#22C55E",
      },
      {
        label: "수력",
        data: data.map((item) => item["수력"]),
        backgroundColor: "#F59E0B",
      },
      {
        label: "원자력",
        data: data.map((item) => item["원자력"]),
        backgroundColor: "#EF4444",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const }, // 수정: 허용된 값으로 명시
      title: { display: true, text: title },
    },
    scales: {
      x: { title: { display: true, text: "연도" } },
      y: { title: { display: true, text: "에너지 소비량 (1000톤)" } },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
