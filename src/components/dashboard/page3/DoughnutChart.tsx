import React from "react";
import { Doughnut } from "react-chartjs-2";

interface DoughnutChartProps {
  data: { [key: string]: number };
  title: string;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, title }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: ["#3B82F6", "#22C55E", "#F59E0B", "#EF4444"],
        hoverBackgroundColor: ["#2563EB", "#16A34A", "#D97706", "#DC2626"], // hover 색상 추가
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "right" as const },
      title: { display: true, text: title },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default DoughnutChart;
