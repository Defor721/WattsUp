// DoughnutChart.tsx
import React from "react";
import { Doughnut } from "react-chartjs-2";

interface DoughnutChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
  };
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data }) => {
  const options = {
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "항목별 비율",
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
