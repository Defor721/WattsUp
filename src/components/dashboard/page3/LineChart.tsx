import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Chart.js 플러그인 및 스케일 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface LineChartProps {
  data: { category: string; values: number[] }[];
  title: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, title }) => {
  const chartData = {
    labels:
      data.length > 0 ? data[0].values.map((_, idx) => `${2023 - idx}`) : [],
    datasets: data.map((item, index) => ({
      label: item.category,
      data: item.values,
      borderColor: ["#3B82F6", "#22C55E", "#F59E0B", "#EF4444"][index % 4],
      backgroundColor: "transparent",
      tension: 0.4, // 부드러운 곡선
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: title },
    },
    scales: {
      x: { title: { display: true, text: "연도" } },
      y: { title: { display: true, text: "값" } },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
