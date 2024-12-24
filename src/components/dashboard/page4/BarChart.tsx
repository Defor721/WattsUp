import React from "react";
import { Bar } from "react-chartjs-2";

interface BarChartProps {
  data: {
    labels: number[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
    }[];
  };
  title: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "연도",
        },
      },
      y: {
        title: {
          display: true,
          text: title,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
