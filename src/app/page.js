// app/page.js
import StatsCard from './components/StatsCard';
import ChartCard from './components/ChartCard';

const statsData = [
  { icon: 'fa-users', title: 'Total Users', value: '15,687' },
  { icon: 'fa-shopping-bag', title: 'Total Sales', value: '$124,563' },
  { icon: 'fa-chart-line', title: 'Revenue', value: '$67,895' },
  { icon: 'fa-percent', title: 'Growth', value: '+24.5%' },
];

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
        <ChartCard title="Sales Analytics" chartId="salesChart" />
        <ChartCard title="User Growth" chartId="userGrowthChart" />
      </div>
    </div>
  );
}
