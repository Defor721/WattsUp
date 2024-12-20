import React from "react";
import { Line } from "react-chartjs-2";

interface LineChartProps {
  data: { category: string; values: number[] }[];
  title: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, title }) => {
  const chartData = {
    labels: ["2022", "2021", "2020", "2019"],
    datasets: data.map((item, index) => ({
      label: item.category,
      data: item.values,
      borderColor: ["#3B82F6", "#22C55E", "#F59E0B", "#EF4444"][index % 4],
      backgroundColor: "transparent",
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const }, // 수정: position 값을 유니언 타입에 맞게 명시적으로 설정
      title: { display: true, text: title },
    },
    scales: {
      x: { title: { display: true, text: "연도" } },
      y: { title: { display: true, text: "수입량" } },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
