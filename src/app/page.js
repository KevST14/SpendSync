// app/page.js
import Sidebar from './components/Sidebar';
import LineChart from './components/LineChart';
import BarChart from './components/BarChart';
import { FaWallet, FaPiggyBank, FaChartPie, FaCog } from 'react-icons/fa';

export default function DashboardPage() {
  // Sample data
  const expenseLabels = ['January', 'February', 'March', 'April', 'May', 'June'];
  const expenseData = [500, 700, 1200, 800, 1100, 1500];
  const incomeLabels = ['January', 'February', 'March', 'April', 'May', 'June'];
  const incomeData = [2000, 2400, 2600, 3000, 3200, 3500];

  return (
    <div className="dashboard flex min-h-screen">
      <Sidebar />
      <main className="main-content flex-1 p-6">
        <header className="flex justify-between items-center mb-6 p-4 bg-surface rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold">Personal Finance Dashboard</h1>
          <div className="user-info flex items-center">
            <img src="https://via.placeholder.com/40" alt="User Avatar" className="avatar rounded-full mr-3" />
            <span>John Doe</span>
          </div>
        </header>

        {/* Financial Overview Section */}
        <section className="financial-overview">
          <h2 className="text-xl font-bold mb-6">Dashboard Overview</h2>
          <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="stat-card glow pulse bg-surface p-6 rounded-lg shadow-md">
              <FaWallet className="text-2xl text-accent mb-2" />
              <div className="stat-info">
                <h3>Total Expenses</h3>
                <p>$2,345</p>
              </div>
            </div>
            <div className="stat-card glow pulse bg-surface p-6 rounded-lg shadow-md">
              <FaPiggyBank className="text-2xl text-accent mb-2" />
              <div className="stat-info">
                <h3>Total Income</h3>
                <p>$4,000</p>
              </div>
            </div>
            <div className="stat-card glow pulse bg-surface p-6 rounded-lg shadow-md">
              <FaChartPie className="text-2xl text-accent mb-2" />
              <div className="stat-info">
                <h3>Savings</h3>
                <p>$1,200</p>
              </div>
            </div>
            <div className="stat-card glow pulse bg-surface p-6 rounded-lg shadow-md">
              <FaCog className="text-2xl text-accent mb-2" />
              <div className="stat-info">
                <h3>Budget Utilization</h3>
                <p>75%</p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-container grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="chart-card glow bg-surface p-6 rounded-lg shadow-md">
              <h3 className="text-secondary mb-3">Expenses Over Time</h3>
              <LineChart title="Expenses" labels={expenseLabels} dataValues={expenseData} borderColor="#FF4757" />
            </div>
            <div className="chart-card glow bg-surface p-6 rounded-lg shadow-md">
              <h3 className="text-secondary mb-3">Income Over Time</h3>
              <BarChart title="Income" categories={incomeLabels} dataValues={incomeData} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
