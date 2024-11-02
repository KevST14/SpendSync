// app/components/BarChart.js
"use client";
import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import ApexCharts with server-side rendering disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const BarChart = ({ title, categories, dataValues }) => {
  if (typeof window === "undefined") {
    return null; // Ensure no render on the server
  }

  const options = {
    chart: { id: 'bar-chart', toolbar: { show: false } },
    colors: ['#4a00e0'],
    plotOptions: { bar: { horizontal: false, columnWidth: '50%' } },
    xaxis: { categories: categories },
    dataLabels: { enabled: false },
    title: { text: title, style: { color: '#b3b3b3' } },
    grid: { borderColor: '#444' },
  };

  const series = [{ name: title, data: dataValues }];

  return <Chart options={options} series={series} type="bar" height="300" />;
};

export default BarChart;
