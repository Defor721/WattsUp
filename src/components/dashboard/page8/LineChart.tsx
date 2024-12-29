import React from "react";
import { Line } from "react-chartjs-2";
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

// 필요한 스케일 및 요소 등록
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
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "기간별 SMP 추이",
      },
    },
    scales: {
      x: {
        type: "category" as const, // 등록한 "category" 스케일 사용
        title: {
          display: true,
          text: "기간",
        },
      },
      y: {
        title: {
          display: true,
          text: "SMP 값",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
