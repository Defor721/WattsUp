import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";

// Chart.js 요소 등록
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
);

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
    }[];
  };
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#ffffff",
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff",
        },
      },
      y: {
        ticks: {
          callback: (value: any) => `${value.toLocaleString()}`,
          color: "#ffffff",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
