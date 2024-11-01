// app/page.js
import StatsCard from './components/StatsCard';
import ChartCard from './components/ChartCard';

const statsData = [
  { icon: 'fa-users', title: 'Total Users', value: '15,687' },
  { icon: 'fa-shopping-bag', title: 'Total Sales', value: '$124,563' },
  { icon: 'fa-chart-line', title: 'Revenue', value: '$67,895' },
  { icon: 'fa-percent', title: 'Growth', value: '+24.5%' },
];

const lineChartData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Revenue',
      data: [10000, 15000, 8000, 20000, 30000, 25000],
      borderColor: '#4a00e0',
      backgroundColor: 'rgba(74, 0, 224, 0.2)',
      tension: 0.4,
    },
  ],
};

const barChartData = {
  labels: ['Product A', 'Product B', 'Product C', 'Product D'],
  datasets: [
    {
      label: 'Sales',
      data: [5000, 10000, 7000, 15000],
      backgroundColor: '#8e2de2',
    },
  ],
};

export default function DashboardPage() {
  return (
    <div className="p-6 bg-background text-textPrimary">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
        <ChartCard title="Revenue Over Time" chartData={lineChartData} chartType="line" />
        <ChartCard title="Product Sales" chartData={barChartData} chartType="bar" />
      </div>
    </div>
  );
}
