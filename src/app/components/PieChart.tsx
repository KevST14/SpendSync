"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

// Dynamically import ApexCharts with server-side rendering disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface PieChartProps {
  categories: string[];
  dataValues: number[];
}

const PieChart = ({ categories, dataValues }: PieChartProps) => {
  const options: ApexOptions = {
    labels: categories,
    chart: {
      type: "donut",
    },
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
    },
    colors: ["#4a00e0", "#8e2de2", "#00fff0", "#ffd700", "#ff4757"],
  };

  return (
    <div className="pie-chart">
      <Chart options={options} series={dataValues} type="donut" width="100%" />
    </div>
  );
};

export default PieChart;
