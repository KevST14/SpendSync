"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Sidebar from "../components/Sidebar";
import { FaPlus, FaSearch, FaFilter, FaCheck, FaTimes } from "react-icons/fa";
import type { Expense, NewExpense } from "@/lib/types";

const PieChart = dynamic(() => import("../components/PieChart"), { ssr: false });

const emptyForm: NewExpense = { date: "", category: "", amount: 0, notes: "" };

export default function ExpensesPage() {
  const categories = ["Groceries", "Utilities", "Entertainment", "Transport", "Healthcare"];
  const categoryExpenses = [300, 150, 200, 100, 250];

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewExpense>(emptyForm);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchExpenses() {
      const response = await fetch("/api/expenses");
      const data: Expense[] = await response.json();
      setExpenses(data);
      setFilteredExpenses(data);
    }
    fetchExpenses();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredExpenses(
      term
        ? expenses.filter(
            (expense) =>
              expense.category.toLowerCase().includes(term.toLowerCase()) ||
              expense.notes.toLowerCase().includes(term.toLowerCase()),
          )
        : expenses,
    );
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const addExpense = async () => {
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result: { expense: Expense } = await response.json();
    setExpenses((prev) => [...prev, result.expense]);
    setFilteredExpenses((prev) => [...prev, result.expense]);
    setForm(emptyForm);
    setShowForm(false);
  };

  return (
    <div className="expenses-page flex">
      <Sidebar />
      <main className="main-content flex-1 p-8 space-y-10">
        {/* Page Header */}
        <header className="header bg-surface rounded-lg shadow-lg p-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-primary">Expenses Overview</h1>
        </header>

        {/* Overview Cards */}
        <section className="overview grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Monthly Expenses", value: "$1,200", color: "text-danger" },
            { label: "Average Daily Expense", value: "$40", color: "text-warning" },
            { label: "Top Category", value: "Groceries: $300", color: "text-success" },
            { label: "Recurring Expenses", value: "$450", color: "text-accent" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="stat-card p-6 bg-surface rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-medium text-secondary">{label}</h3>
              <p className={`text-4xl font-bold mt-2 ${color}`}>{value}</p>
            </div>
          ))}
        </section>

        {/* Expense By Category Chart Card */}
        <section className="chart-section bg-surface rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Expenses by Category</h2>
          <div className="flex justify-center">
            <PieChart categories={categories} dataValues={categoryExpenses} />
          </div>
        </section>

        {/* Filter & Search Card */}
        <section className="search-filter-card bg-surface rounded-lg shadow-md p-6 flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button className="flex items-center bg-primary text-white p-3 rounded-lg shadow-md hover:bg-opacity-90 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
              <FaFilter className="mr-2" /> Filter
            </button>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search expenses..."
                className="p-3 rounded-lg bg-background text-primary shadow-md focus:outline-none"
                value={searchTerm}
                onChange={handleSearch}
              />
              <FaSearch className="absolute right-2 text-secondary" />
            </div>
          </div>
        </section>

        {/* Expense List with Add New Expense Section */}
        <section className="expense-list bg-surface rounded-lg shadow-md p-8 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-primary">Expense List</h2>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-opacity-90 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              <FaPlus className="mr-2" /> Add New Expense
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg shadow-inner mb-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary text-white text-lg">
                  <th className="p-3 border-b border-secondary">Date</th>
                  <th className="p-3 border-b border-secondary">Category</th>
                  <th className="p-3 border-b border-secondary">Amount</th>
                  <th className="p-3 border-b border-secondary">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length ? (
                  filteredExpenses.map((expense, index) => (
                    <tr
                      key={index}
                      className="hover:bg-background transition-colors text-lg"
                    >
                      <td className="p-3 border-b border-secondary">{expense.date}</td>
                      <td className="p-3 border-b border-secondary">{expense.category}</td>
                      <td className="p-3 border-b border-secondary text-danger font-semibold">
                        - ${expense.amount}
                      </td>
                      <td className="p-3 border-b border-secondary">{expense.notes}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3 text-center text-secondary" colSpan={4}>
                      No expenses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add New Expense Section */}
          {showForm && (
            <div className="add-expense-section p-6 bg-surface rounded-lg shadow-md space-y-4">
              <h2 className="text-xl font-semibold text-primary mb-2">Add New Expense</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleFormChange}
                  className="p-3 rounded-lg bg-background text-primary shadow-md focus:outline-none"
                />
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={form.category}
                  onChange={handleFormChange}
                  className="p-3 rounded-lg bg-background text-primary shadow-md focus:outline-none"
                />
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={form.amount || ""}
                  onChange={handleFormChange}
                  className="p-3 rounded-lg bg-background text-primary shadow-md focus:outline-none"
                />
              </div>
              <input
                type="text"
                name="notes"
                placeholder="Notes"
                value={form.notes}
                onChange={handleFormChange}
                className="p-3 rounded-lg bg-background text-primary shadow-md w-full focus:outline-none mt-4"
              />
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg shadow-md hover:bg-opacity-90 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"
                  onClick={() => {
                    setForm(emptyForm);
                    setShowForm(false);
                  }}
                >
                  <FaTimes className="mr-2" /> Cancel
                </button>
                <button
                  className="flex items-center px-4 py-2 bg-success text-white rounded-lg shadow-md hover:bg-opacity-90 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-success focus:ring-opacity-50"
                  onClick={addExpense}
                >
                  <FaCheck className="mr-2" /> Save Expense
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
