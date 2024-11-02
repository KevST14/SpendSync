// src/app/expenses/page.js
"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { FaPlus, FaSearch, FaFilter, FaChartPie } from 'react-icons/fa';

const PieChart = dynamic(() => import('../components/PieChart'), { ssr: false });

export default function ExpensesPage() {
  const categories = ["Groceries", "Utilities", "Entertainment", "Transport", "Healthcare"];
  const categoryExpenses = [300, 150, 200, 100, 250];
  
  const [expenses, setExpenses] = useState([
    { date: "01/06/2024", category: "Groceries", amount: 150, notes: "Weekly shopping" },
    { date: "02/06/2024", category: "Utilities", amount: 80, notes: "Electricity bill" },
    { date: "03/06/2024", category: "Entertainment", amount: 50, notes: "Movie night" },
  ]);

  return (
    <div className="expenses-page p-6">
      {/* Page Header */}
      <header className="header mb-6 p-4 bg-surface rounded-lg shadow-lg flex justify-between items-center">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <button className="bg-primary text-text-primary p-3 rounded-lg flex items-center">
          <FaPlus className="mr-2" /> Add New Expense
        </button>
      </header>

      {/* Expense Overview */}
      <section className="overview grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface p-6 rounded-lg shadow-md">
          <h3 className="text-secondary mb-2">Total Monthly Expenses</h3>
          <p className="text-3xl font-bold">$1,200</p>
        </div>
        <div className="bg-surface p-6 rounded-lg shadow-md">
          <h3 className="text-secondary mb-2">Average Daily Expense</h3>
          <p className="text-3xl font-bold">$40</p>
        </div>
        <div className="bg-surface p-6 rounded-lg shadow-md">
          <h3 className="text-secondary mb-2">Top Category: Groceries</h3>
          <p className="text-3xl font-bold">$300</p>
        </div>
      </section>

      {/* Expense By Category Chart */}
      <section className="chart-section mb-8">
        <h2 className="text-xl font-bold mb-4">Expenses by Category</h2>
        <div className="bg-surface p-6 rounded-lg shadow-md">
          <PieChart categories={categories} dataValues={categoryExpenses} />
        </div>
      </section>

      {/* Expense Filter & Search */}
      <section className="search-filter mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button className="bg-primary text-text-primary p-2 rounded-lg flex items-center">
            <FaFilter className="mr-2" /> Filter
          </button>
          <input
            type="text"
            placeholder="Search expenses..."
            className="bg-background p-2 rounded-lg text-text-primary"
          />
          <FaSearch className="text-secondary ml-2" />
        </div>
      </section>

      {/* Detailed Expense List */}
      <section className="expense-list">
        <h2 className="text-xl font-bold mb-4">Expense List</h2>
        <div className="bg-surface p-6 rounded-lg shadow-md">
          <table className="w-full text-left">
            <thead className="bg-primary text-text-primary">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Category</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr key={index} className="hover:bg-background transition-colors">
                  <td className="p-3">{expense.date}</td>
                  <td className="p-3">{expense.category}</td>
                  <td className="p-3 text-danger font-semibold">- ${expense.amount}</td>
                  <td className="p-3">{expense.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
