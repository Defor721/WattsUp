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
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "right" as const }, // 수정: 'as const'로 허용된 값 설정
      title: { display: true, text: title },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default DoughnutChart;
