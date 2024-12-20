import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface BarChartProps {
  data: { category: string; value: number }[];
  title?: string; // 추가: 제목을 동적으로 전달
  xAxisLabel?: string; // 추가: x축 레이블 옵션
  yAxisLabel?: string; // 추가: y축 레이블 옵션
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  title = "경제 지표 개요", // 기본 제목
  xAxisLabel = "항목", // 기본 x축 레이블
  yAxisLabel = "값", // 기본 y축 레이블
}) => {
  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        label: "경제 지표",
        data: data.map((item) => item.value),
        backgroundColor: data.map(
          (_, index) =>
            // 색상을 순환적으로 할당
            ["#3B82F6", "#22C55E", "#F59E0B", "#EF4444", "#6366F1"][index % 5],
        ),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: title, // 전달받은 제목
      },
    },
    scales: {
      x: {
        display: true,
        title: { display: true, text: xAxisLabel }, // 전달받은 x축 레이블
      },
      y: {
        display: true,
        title: { display: true, text: yAxisLabel }, // 전달받은 y축 레이블
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
