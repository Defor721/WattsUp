import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface LineChartProps {
  data: {
    연도: number;
    수력: number;
    화력: number;
    원자력: number;
    자가용: number;
  }[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.연도),
    datasets: [
      {
        label: "수력 (GWh)",
        data: data.map((item) => item.수력),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: false,
      },
      {
        label: "화력 (GWh)",
        data: data.map((item) => item.화력),
        borderColor: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        fill: false,
      },
      {
        label: "원자력 (GWh)",
        data: data.map((item) => item.원자력),
        borderColor: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        fill: false,
      },
      {
        label: "자가용 (GWh)",
        data: data.map((item) => item.자가용),
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
        text: "연도별 발전량 추이 (수력, 화력, 원자력, 자가용)",
      },
    },
    scales: {
      x: {
        display: true,
        title: { display: true, text: "연도" },
      },
      y: {
        display: true,
        title: { display: true, text: "GWh" },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
