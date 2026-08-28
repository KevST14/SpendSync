"use client";

import dynamic from "next/dynamic";
import {
  FaPiggyBank,
  FaChartPie,
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaRedo,
  FaShoppingCart,
  FaBolt,
  FaMoneyBillWave,
} from "react-icons/fa";

const LineChart = dynamic(() => import("@/app/components/LineChart"), { ssr: false });
const BarChart = dynamic(() => import("@/app/components/BarChart"), { ssr: false });
const PieChart = dynamic(() => import("@/app/components/PieChart"), { ssr: false });

export default function DashboardPage() {
  const categories = [
    "Groceries",
    "Utilities",
    "Entertainment",
    "Transport",
    "Healthcare",
  ];
  const categoryExpenses = [300, 150, 200, 100, 250];

  return (
    <div className="space-y-8">
      <header className="header flex items-center justify-between rounded-lg bg-surface p-4 shadow-lg">
        <h1 className="text-2xl font-bold">Personal Finance Dashboard</h1>
        <div className="user-info flex items-center gap-3">
          <span className="avatar" aria-hidden="true">
            JD
          </span>
          <span>John Doe</span>
        </div>
      </header>

      {/* Dashboard Overview */}
      <h2 className="mb-4 text-xl font-bold">Dashboard Overview</h2>
      <div className="stats-grid mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="stat-card glow pulse rounded-lg bg-surface p-6 shadow-md">
          <FaPiggyBank className="mb-2 text-2xl text-accent" />
          <h3>Total Savings</h3>
          <p className="text-3xl font-bold">$1,500</p>
        </div>
        <div className="stat-card glow pulse rounded-lg bg-surface p-6 shadow-md">
          <FaChartPie className="mb-2 text-2xl text-accent" />
          <h3>Total Income</h3>
          <p className="text-3xl font-bold">$4,000</p>
        </div>
        <div className="stat-card glow pulse rounded-lg bg-surface p-6 shadow-md">
          <FaFileInvoiceDollar className="mb-2 text-2xl text-accent" />
          <h3>Total Expenses</h3>
          <p className="text-3xl font-bold">$2,345</p>
        </div>
        <div className="stat-card glow pulse rounded-lg bg-surface p-6 shadow-md">
          <FaCalendarAlt className="mb-2 text-2xl text-accent" />
          <h3>Budget Utilization</h3>
          <p className="text-3xl font-bold">75%</p>
        </div>
        <div className="stat-card glow pulse rounded-lg bg-surface p-6 shadow-md">
          <FaRedo className="mb-2 text-2xl text-accent" />
          <h3>Recurring Bills</h3>
          <p className="text-3xl font-bold">$650</p>
        </div>
      </div>

      {/* Financial Charts Section */}
      <div className="charts-container mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="chart-card rounded-lg bg-surface p-6 shadow-md">
          <h3 className="mb-3 text-secondary">Income Over Time</h3>
          <LineChart
            title="Income"
            labels={["Jan", "Feb", "Mar", "Apr", "May"]}
            dataValues={[4000, 4200, 3800, 4500, 4700]}
            borderColor="#00ff9d"
          />
        </div>
        <div className="chart-card rounded-lg bg-surface p-6 shadow-md">
          <h3 className="mb-3 text-secondary">Expenses Over Time</h3>
          <LineChart
            title="Expenses"
            labels={["Jan", "Feb", "Mar", "Apr", "May"]}
            dataValues={[2000, 2400, 2200, 2100, 2300]}
            borderColor="#ff4757"
          />
        </div>
        <div className="chart-card rounded-lg bg-surface p-6 shadow-md">
          <h3 className="mb-3 text-secondary">Expense Breakdown by Category</h3>
          <PieChart categories={categories} dataValues={categoryExpenses} />
        </div>
        <div className="chart-card rounded-lg bg-surface p-6 shadow-md">
          <h3 className="mb-3 text-secondary">Income vs. Expenses</h3>
          <BarChart
            title="Income vs. Expenses"
            categories={["Jan", "Feb", "Mar", "Apr", "May"]}
            dataValues={[4000, 4200, 3800, 4500, 4700]}
          />
        </div>
      </div>

      <h2 className="mb-4 text-xl font-bold">Recent Transactions</h2>
      <div className="rounded-lg bg-surface p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <select className="rounded bg-background p-2 text-secondary">
            <option value="date">Sort by Date</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>

        <table className="w-full overflow-hidden rounded-lg text-left">
          <thead className="bg-primary text-text-primary">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Category</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Notes</th>
            </tr>
          </thead>
          <tbody className="bg-surface">
            <tr className="transition-colors hover:bg-background">
              <td className="flex items-center p-3">
                <FaCalendarAlt className="mr-2 text-secondary" /> 01/06/2024
              </td>
              <td className="flex items-center p-3">
                <FaShoppingCart className="mr-2 text-secondary" /> Groceries
              </td>
              <td className="p-3 font-semibold text-danger">- $150</td>
              <td className="p-3">Weekly shopping</td>
            </tr>
            <tr className="transition-colors hover:bg-background">
              <td className="flex items-center p-3">
                <FaCalendarAlt className="mr-2 text-secondary" /> 02/06/2024
              </td>
              <td className="flex items-center p-3">
                <FaBolt className="mr-2 text-secondary" /> Utilities
              </td>
              <td className="p-3 font-semibold text-danger">- $80</td>
              <td className="p-3">Electricity bill</td>
            </tr>
            <tr className="transition-colors hover:bg-background">
              <td className="flex items-center p-3">
                <FaCalendarAlt className="mr-2 text-secondary" /> 03/06/2024
              </td>
              <td className="flex items-center p-3">
                <FaMoneyBillWave className="mr-2 text-secondary" /> Income
              </td>
              <td className="p-3 font-semibold text-success">+ $500</td>
              <td className="p-3">Freelance payment</td>
            </tr>
            {/* Additional transactions here */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
