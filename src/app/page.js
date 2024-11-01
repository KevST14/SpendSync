// app/page.js
"use client";
import { useEffect, useState } from 'react';
import StatsCard from './components/StatsCard';
import ChartCard from './components/ChartCard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Loader from './components/Loader';
import { fetchData } from './utils/fetchData';

export default function DashboardPage() {
  const [statsData, setStatsData] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function loadData() {
      const stats = await fetchData('https://jsonplaceholder.typicode.com/posts'); // Replace with your API URL
      setStatsData([
        { icon: 'fa-users', title: 'Total Users', value: stats.length },
        { icon: 'fa-shopping-bag', title: 'Total Sales', value: `$${(stats.length * 500).toLocaleString()}` },
        { icon: 'fa-chart-line', title: 'Revenue', value: `$${(stats.length * 300).toLocaleString()}` },
        { icon: 'fa-percent', title: 'Growth', value: '+24.5%' },
      ]);

      setChartData({
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Revenue',
            data: stats.slice(0, 6).map((_, index) => (index + 1) * 10000),
            borderColor: '#4a00e0',
            backgroundColor: 'rgba(74, 0, 224, 0.2)',
            tension: 0.4,
          },
        ],
      });
    }

    loadData();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-background text-textPrimary">
        <Header />

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chartData ? (
            <>
              <ChartCard title="Revenue Over Time" chartData={chartData} chartType="line" />
              <ChartCard title="Product Sales" chartData={chartData} chartType="bar" />
            </>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
}
