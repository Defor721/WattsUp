import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface DoughnutChartProps {
  data: {
    labels: string[];
    datasets: {
      data: (string | number)[]; // 기존에 string이 포함될 수 있음
      backgroundColor: string[];
    }[];
  };
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data }) => {
  // 데이터 변환: string | number -> number
  const normalizedData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      data: dataset.data.map((value) =>
        typeof value === "string" ? parseFloat(value) : value,
      ) as number[], // 강제 변환 후 number[]로 설정
    })),
  };

  const options = {
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#ffffff",
        },
      },
      title: {
        display: true,
        text: "지역별 고객 비율",
        color: "#ffffff",
        font: {
          size: 16,
        },
      },
    },
  };

  return <Doughnut data={normalizedData} options={options} />;
};

export default DoughnutChart;
