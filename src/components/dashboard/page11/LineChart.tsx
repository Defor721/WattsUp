import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  CoreChartOptions,
  PluginChartOptions,
  LineControllerChartOptions,
  DatasetChartOptions,
  ScaleChartOptions,
} from "chart.js";
import { _DeepPartialObject } from "chart.js/dist/types/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill?: boolean;
    }[];
  };
  title: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, title }) => {
  const options: _DeepPartialObject<
    CoreChartOptions<"line"> &
      PluginChartOptions<"line"> &
      DatasetChartOptions<"line"> &
      ScaleChartOptions<"line"> &
      LineControllerChartOptions
  > = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 18,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutBounce",
    },
  };

  return (
    <div className="w-full rounded-lg bg-gray-800 p-4 shadow-lg">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
