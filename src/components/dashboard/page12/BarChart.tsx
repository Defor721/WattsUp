import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface BarChartProps {
  data: any;
  title: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  return (
    <div className="w-full rounded-lg bg-gray-800 p-4 shadow-lg">
      <h2 className="mb-4 text-lg font-bold text-white">{title}</h2>
      <Bar data={data} />
    </div>
  );
};

export default BarChart;
