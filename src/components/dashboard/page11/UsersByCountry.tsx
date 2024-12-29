import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface UsersByCountryProps {
  data: { 기간: string; 연료단가_원자력: number }[];
}

const UsersByCountry: React.FC<UsersByCountryProps> = ({ data }) => {
  // Group data by year and calculate average 연료단가_원자력
  const aggregatedData = data.reduce(
    (acc, curr) => {
      const year = curr.기간.split("/")[0];
      if (!acc[year]) {
        acc[year] = { year, total: 0, count: 0 };
      }
      acc[year].total += curr.연료단가_원자력;
      acc[year].count += 1;
      return acc;
    },
    {} as Record<string, { year: string; total: number; count: number }>,
  );

  const processedData = Object.values(aggregatedData).map((item) => ({
    label: item.year,
    value: item.total / item.count,
  }));

  const chartData = {
    labels: processedData.map((item) => item.label),
    datasets: [
      {
        data: processedData.map((item) => item.value),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FFA07A",
          "#20B2AA",
          "#9370DB",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FFA07A",
          "#20B2AA",
          "#9370DB",
        ],
      },
    ],
  };

  return (
    <div className="w-full rounded-lg bg-gray-800 p-4 shadow-lg">
      <h2 className="mb-4 text-lg font-bold text-white">
        연도별 평균 원자력 연료단가
      </h2>
      <Pie data={chartData} />
    </div>
  );
};

export default UsersByCountry;
