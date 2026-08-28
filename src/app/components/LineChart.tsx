"use client";

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
  type ChartOptions,
} from "chart.js";

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
  title: string;
  labels: string[];
  dataValues: number[];
  borderColor?: string;
}

const LineChart = ({ title, labels, dataValues, borderColor }: LineChartProps) => {
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: dataValues,
        borderColor: borderColor || "#00fff0",
        backgroundColor: "rgba(0, 255, 240, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { color: "#444" } },
      y: { grid: { color: "#444" } },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
