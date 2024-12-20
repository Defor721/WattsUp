import React from "react";
import { Doughnut } from "react-chartjs-2";

interface DoughnutChartProps {
  data: {
    수출액: number;
    수입액: number;
    경상수지: number;
  };
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data }) => {
  const chartData = {
    labels: ["수출액", "수입액", "경상수지"],
    datasets: [
      {
        data: [data.수출액, data.수입액, data.경상수지],
        backgroundColor: ["#3B82F6", "#F59E0B", "#EF4444"],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "경제 구성 비율",
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default DoughnutChart;
