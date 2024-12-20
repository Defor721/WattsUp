import React from "react";
import { Doughnut } from "react-chartjs-2";

interface DoughnutChartProps {
  data: {
    수력: number;
    화력: number;
    원자력: number;
    자가용: number;
  };
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data }) => {
  const chartData = {
    labels: ["수력", "화력", "원자력", "자가용"],
    datasets: [
      {
        data: [data.수력, data.화력, data.원자력, data.자가용],
        backgroundColor: ["#3B82F6", "#F59E0B", "#EF4444", "#22C55E"],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "총발전량 비율",
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default DoughnutChart;
