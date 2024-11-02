// app/components/LineChart.js
"use client";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ title, labels, dataValues, borderColor }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: dataValues,
        borderColor: borderColor || '#00fff0',
        backgroundColor: 'rgba(0, 255, 240, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { color: '#444' } },
      y: { grid: { color: '#444' } },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
