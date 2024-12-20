import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface LineChartProps {
  data: {
    연도: number;
    수출액: number;
    수입액: number;
    환율: number;
  }[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.연도),
    datasets: [
      {
        label: "수출액 (백만US$)",
        data: data.map((item) => item.수출액),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: false,
      },
      {
        label: "수입액 (백만US$)",
        data: data.map((item) => item.수입액),
        borderColor: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        fill: false,
      },
      {
        label: "환율 (원/US$)",
        data: data.map((item) => item.환율),
        borderColor: "#22C55E",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "연도별 주요 경제지표 추이 (수출액, 수입액, 환율)",
      },
    },
    scales: {
      x: {
        display: true,
        title: { display: true, text: "연도" },
      },
      y: {
        display: true,
        title: { display: true, text: "값" },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
