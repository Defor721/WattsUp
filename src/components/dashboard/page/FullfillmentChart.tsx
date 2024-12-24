import React from "react";
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import "chart.js/auto";

interface FulfillmentChartProps {
  previousYearData: { name: string; value: number }[];
  currentYearData: { name: string; value: number }[];
}

const FulfillmentChart: React.FC<FulfillmentChartProps> = ({
  previousYearData,
  currentYearData,
}) => {
  const labels = previousYearData.map((item) => item.name);

  const data = {
    labels,
    datasets: [
      {
        label: "지난 연도",
        data: previousYearData.map((item) => item.value),
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56, 189, 248, 0.2)", // 투명도 있는 배경색
        fill: true,
        tension: 0.4,
      },
      {
        label: "현재 연도",
        data: currentYearData.map((item) => item.value),
        borderColor: "#f472b6",
        backgroundColor: "rgba(244, 114, 182, 0.2)", // 투명도 있는 배경색
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Chart.js Options
  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff", // 레이블 색상
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label}: ${context.parsed.y.toLocaleString()} GWh`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#fff", // x축 레이블 색상
        },
      },
      y: {
        ticks: {
          callback: (value: any) => `${value} GWh`, // y축 값에 단위 추가
          color: "#fff", // y축 레이블 색상
        },
      },
    },
  };

  return (
    <div className="rounded-lg bg-gray-800 p-4 shadow-md">
      <h3 className="mb-4 text-center text-lg font-semibold text-white">
        연도별 전력 발전량 비교
      </h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default FulfillmentChart;
