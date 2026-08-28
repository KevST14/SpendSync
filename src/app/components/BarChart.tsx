"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

// Dynamically import ApexCharts with server-side rendering disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface BarChartProps {
  title: string;
  categories: string[];
  dataValues: number[];
}

const BarChart = ({ title, categories, dataValues }: BarChartProps) => {
  const options: ApexOptions = {
    chart: { id: "bar-chart", toolbar: { show: false } },
    colors: ["#4a00e0"],
    plotOptions: { bar: { horizontal: false, columnWidth: "50%" } },
    xaxis: { categories },
    dataLabels: { enabled: false },
    title: { text: title, style: { color: "#b3b3b3" } },
    grid: { borderColor: "#444" },
  };

  const series = [{ name: title, data: dataValues }];

  return <Chart options={options} series={series} type="bar" height="300" />;
};

export default BarChart;
