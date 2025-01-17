// src/app/page.js
"use client";

import dynamic from 'next/dynamic';
import Sidebar from './components/Sidebar';
import { FaPiggyBank, FaChartPie, FaFileInvoiceDollar, FaCalendarAlt, FaRedo, FaShoppingCart, FaBolt, FaMoneyBillWave } from 'react-icons/fa';

const LineChart = dynamic(() => import('./components/LineChart'), { ssr: false });
const BarChart = dynamic(() => import('./components/BarChart'), { ssr: false });
const PieChart = dynamic(() => import('./components/PieChart'), { ssr: false });

export default function DashboardPage() {
  const categories = ["Groceries", "Utilities", "Entertainment", "Transport", "Healthcare"];
  const categoryExpenses = [300, 150, 200, 100, 250];

  return (
    <div className="dashboard flex">
      <Sidebar />
      <main className="main-content flex-1 p-6">
        <header className="header mb-6 p-4 bg-surface rounded-lg shadow-lg flex justify-between items-center">
          <h1 className="text-2xl font-bold">Personal Finance Dashboard</h1>
          <div className="user-info flex items-center">
            <img src="https://via.placeholder.com/40" alt="User Avatar" className="avatar rounded-full mr-3" />
            <span>John Doe</span>
          </div>
        </header>

        {/* Dashboard Overview */}
        <h2 className="text-xl font-bold mb-4">Dashboard Overview</h2>
        <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="stat-card bg-surface p-6 rounded-lg shadow-md glow pulse">
            <FaPiggyBank className="text-2xl text-accent mb-2" />
            <h3>Total Savings</h3>
            <p className="text-3xl font-bold">$1,500</p>
          </div>
          <div className="stat-card bg-surface p-6 rounded-lg shadow-md glow pulse">
            <FaChartPie className="text-2xl text-accent mb-2" />
            <h3>Total Income</h3>
            <p className="text-3xl font-bold">$4,000</p>
          </div>
          <div className="stat-card bg-surface p-6 rounded-lg shadow-md glow pulse">
            <FaFileInvoiceDollar className="text-2xl text-accent mb-2" />
            <h3>Total Expenses</h3>
            <p className="text-3xl font-bold">$2,345</p>
          </div>
          <div className="stat-card bg-surface p-6 rounded-lg shadow-md glow pulse">
            <FaCalendarAlt className="text-2xl text-accent mb-2" />
            <h3>Budget Utilization</h3>
            <p className="text-3xl font-bold">75%</p>
          </div>
          <div className="stat-card bg-surface p-6 rounded-lg shadow-md glow pulse">
            <FaRedo className="text-2xl text-accent mb-2" />
            <h3>Recurring Bills</h3>
            <p className="text-3xl font-bold">$650</p>
          </div>
        </div>

        {/* Financial Charts Section */}
        <div className="charts-container grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="chart-card bg-surface p-6 rounded-lg shadow-md">
            <h3 className="text-secondary mb-3">Income Over Time</h3>
            <LineChart title="Income" labels={["Jan", "Feb", "Mar", "Apr", "May"]} dataValues={[4000, 4200, 3800, 4500, 4700]} borderColor="#00ff9d" />
          </div>
          <div className="chart-card bg-surface p-6 rounded-lg shadow-md">
            <h3 className="text-secondary mb-3">Expenses Over Time</h3>
            <LineChart title="Expenses" labels={["Jan", "Feb", "Mar", "Apr", "May"]} dataValues={[2000, 2400, 2200, 2100, 2300]} borderColor="#ff4757" />
          </div>
          <div className="chart-card bg-surface p-6 rounded-lg shadow-md">
            <h3 className="text-secondary mb-3">Expense Breakdown by Category</h3>
            <PieChart categories={categories} dataValues={categoryExpenses} />
          </div>
          <div className="chart-card bg-surface p-6 rounded-lg shadow-md">
            <h3 className="text-secondary mb-3">Income vs. Expenses</h3>
            <BarChart title="Income vs. Expenses" categories={["Jan", "Feb", "Mar", "Apr", "May"]} dataValues={[4000, 4200, 3800, 4500, 4700]} />
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <div className="bg-surface p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <select className="bg-background text-secondary p-2 rounded">
              <option value="date">Sort by Date</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>
          
          <table className="w-full text-left rounded-lg overflow-hidden">
            <thead className="bg-primary text-text-primary">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Category</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-surface">
              <tr className="hover:bg-background transition-colors">
                <td className="p-3 flex items-center">
                  <FaCalendarAlt className="mr-2 text-secondary" /> 01/06/2024
                </td>
                <td className="p-3 flex items-center">
                  <FaShoppingCart className="mr-2 text-secondary" /> Groceries
                </td>
                <td className="p-3 text-danger font-semibold">- $150</td>
                <td className="p-3">Weekly shopping</td>
              </tr>
              <tr className="hover:bg-background transition-colors">
                <td className="p-3 flex items-center">
                  <FaCalendarAlt className="mr-2 text-secondary" /> 02/06/2024
                </td>
                <td className="p-3 flex items-center">
                  <FaBolt className="mr-2 text-secondary" /> Utilities
                </td>
                <td className="p-3 text-danger font-semibold">- $80</td>
                <td className="p-3">Electricity bill</td>
              </tr>
              <tr className="hover:bg-background transition-colors">
                <td className="p-3 flex items-center">
                  <FaCalendarAlt className="mr-2 text-secondary" /> 03/06/2024
                </td>
                <td className="p-3 flex items-center">
                  <FaMoneyBillWave className="mr-2 text-secondary" /> Income
                </td>
                <td className="p-3 text-success font-semibold">+ $500</td>
                <td className="p-3">Freelance payment</td>
              </tr>
              {/* Additional transactions here */}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}