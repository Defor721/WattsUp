// PieChart.tsx
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

// Chart.js 등록
ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: any;
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  return (
    <div>
      <h2 className="text-center text-lg font-bold text-white">비중 차트</h2>
      <Pie data={data} />
    </div>
  );
};

export default PieChart;
