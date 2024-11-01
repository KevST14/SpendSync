// app/page.js
import Sidebar from './components/Sidebar';

export default function DashboardPage() {
  return (
    <div className="dashboard flex">
      <Sidebar />
      <main className="main-content flex-1 p-6">
        <header className="header mb-6 p-4 bg-surface rounded-lg shadow-lg flex justify-between items-center">
          <h1 className="text-2xl font-bold">Welcome to SpendSync</h1>
          <div className="user-info flex items-center">
            <img src="https://via.placeholder.com/40" alt="User Avatar" className="avatar rounded-full mr-3" />
            <span>John Doe</span>
          </div>
        </header>
        
        {/* Financial Overview Section */}
        <section className="financial-overview">
          <h2 className="text-xl font-bold mb-4">Financial Overview</h2>
          <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Monthly Expenses Card */}
            <div className="stat-card bg-surface p-6 rounded-lg shadow-md">
              <h3 className="text-secondary">Monthly Expenses</h3>
              <p className="text-3xl font-bold">$2,345</p>
            </div>
            {/* Budget Overview Card */}
            <div className="stat-card bg-surface p-6 rounded-lg shadow-md">
              <h3 className="text-secondary">Budget Overview</h3>
              <p className="text-3xl font-bold">$4,000</p>
              <p className="text-success mt-1">75% Utilized</p>
            </div>
            {/* Savings Goals Card */}
            <div className="stat-card bg-surface p-6 rounded-lg shadow-md">
              <h3 className="text-secondary">Savings Goals</h3>
              <p className="text-3xl font-bold">$1,200</p>
              <p className="text-warning mt-1">60% to Goal</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-container grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="chart-card bg-surface p-6 rounded-lg shadow-md">
              <h3 className="text-secondary mb-3">Expenses Over Time</h3>
              <div id="expensesChart"></div>
            </div>
            <div className="chart-card bg-surface p-6 rounded-lg shadow-md">
              <h3 className="text-secondary mb-3">Budget Breakdown</h3>
              <div id="budgetChart"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
