import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface LineChartProps {
  data: {
    labels: number[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
    }[];
  };
  title: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, title }) => {
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

  return <Line data={data} options={options} />;
};

export default LineChart;
