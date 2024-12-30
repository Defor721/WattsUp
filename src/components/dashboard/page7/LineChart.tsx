import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface LineChartProps {
  data: {
    labels: number[]; // 연도 배열
    datasets: {
      label: string; // 데이터셋의 이름
      data: number[]; // 데이터 배열
      borderColor: string; // 선 색상
      backgroundColor: string; // 배경 색상
      fill: boolean; // 선 아래 채우기 여부
    }[];
  };
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#fff", // 범례 텍스트 색상
        },
      },
      title: {
        display: true,
        text: "연도별 판매단가 추이",
        color: "#fff",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#fff", // x축 텍스트 색상
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // x축 그리드 색상
        },
        title: {
          display: true,
          text: "연도",
          color: "#fff",
        },
      },
      y: {
        ticks: {
          callback: function (value: string | number) {
            // 숫자로 변환 후 형식화
            if (typeof value === "number") {
              return `${value.toLocaleString()} 원`;
            }
            return value; // 문자열일 경우 그대로 반환
          },
          color: "#fff", // y축 텍스트 색상
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // y축 그리드 색상
        },
        title: {
          display: true,
          text: "판매단가 (원)",
          color: "#fff",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
