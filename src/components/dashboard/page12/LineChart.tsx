import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

interface LineChartProps {
  data: any;
  title: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, title }) => {
  return (
    <div className="w-full rounded-lg bg-gray-800 p-4 shadow-lg">
      <h2 className="mb-4 text-lg font-bold text-white">{title}</h2>
      <Line data={data} />
    </div>
  );
};

export default LineChart;
