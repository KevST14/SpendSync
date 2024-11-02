// src/app/components/PieChart.js
"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ApexCharts with server-side rendering disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const PieChart = ({ categories, dataValues }) => {
  const options = {
    labels: categories,
    chart: {
      type: 'donut',
    },
    legend: {
      position: 'bottom',
    },
    dataLabels: {
      enabled: true,
    },
    colors: ['#4a00e0', '#8e2de2', '#00fff0', '#ffd700', '#ff4757'],
  };

  const series = dataValues;

  return (
    <div className="pie-chart">
      <Chart options={options} series={series} type="donut" width="100%" />
    </div>
  );
};

export default PieChart;
