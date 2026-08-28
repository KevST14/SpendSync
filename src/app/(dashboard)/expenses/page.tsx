"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaFilter, FaCheck, FaTimes } from "react-icons/fa";
import Chart from "@/app/components/Chart";
import { formatGBP } from "@/lib/format";
import type { Expense, NewExpense } from "@/lib/types";

const emptyForm: NewExpense = { date: "", category: "", amount: 0, notes: "" };

export default function ExpensesPage() {
  const categories = [
    "Groceries",
    "Utilities",
    "Entertainment",
    "Transport",
    "Healthcare",
  ];
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
    <div className="expenses-page space-y-10">
      {/* Page Header */}
      <header className="header flex items-center justify-between rounded-lg bg-surface p-6 shadow-lg">
        <h1 className="text-3xl font-semibold text-primary">Expenses Overview</h1>
      </header>

      {/* Overview Cards */}
      <section className="overview grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {[
          { label: "Total Monthly Expenses", value: "£1,200", color: "text-danger" },
          { label: "Average Daily Expense", value: "£40", color: "text-warning" },
          { label: "Top Category", value: "Groceries: £300", color: "text-success" },
          { label: "Recurring Expenses", value: "£450", color: "text-accent" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="stat-card rounded-lg bg-surface p-6 shadow-md transition-shadow hover:shadow-lg"
          >
            <h3 className="text-lg font-medium text-secondary">{label}</h3>
            <p className={`mt-2 text-4xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </section>

      {/* Expense By Category Chart Card */}
      <section className="chart-section mb-8 rounded-lg bg-surface p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-primary">Expenses by Category</h2>
        <div className="mx-auto max-w-md">
          <Chart kind="doughnut" labels={categories} values={categoryExpenses} />
        </div>
      </section>

      {/* Filter & Search Card */}
      <section className="search-filter-card mb-8 flex items-center justify-between rounded-lg bg-surface p-6 shadow-md">
        <div className="flex items-center space-x-4">
          <button className="flex transform items-center rounded-lg bg-primary p-3 text-white shadow-md transition-transform hover:scale-105 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
            <FaFilter className="mr-2" /> Filter
          </button>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search expenses..."
              className="rounded-lg bg-background p-3 text-primary shadow-md focus:outline-none"
              value={searchTerm}
              onChange={handleSearch}
            />
            <FaSearch className="absolute right-2 text-secondary" />
          </div>
        </div>
      </section>

      {/* Expense List with Add New Expense Section */}
      <section className="expense-list space-y-6 rounded-lg bg-surface p-8 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-primary">Expense List</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex transform items-center rounded-lg bg-primary px-4 py-2 text-white shadow-md transition-transform hover:scale-105 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            <FaPlus className="mr-2" /> Add New Expense
          </button>
        </div>

        <div className="mb-4 overflow-x-auto rounded-lg shadow-inner">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-primary text-lg text-white">
                <th className="border-b border-secondary p-3">Date</th>
                <th className="border-b border-secondary p-3">Category</th>
                <th className="border-b border-secondary p-3">Amount</th>
                <th className="border-b border-secondary p-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length ? (
                filteredExpenses.map((expense, index) => (
                  <tr
                    key={index}
                    className="text-lg transition-colors hover:bg-background"
                  >
                    <td className="border-b border-secondary p-3">{expense.date}</td>
                    <td className="border-b border-secondary p-3">{expense.category}</td>
                    <td className="border-b border-secondary p-3 font-semibold text-danger">
                      - {formatGBP(expense.amount)}
                    </td>
                    <td className="border-b border-secondary p-3">{expense.notes}</td>
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
          <div className="add-expense-section space-y-4 rounded-lg bg-surface p-6 shadow-md">
            <h2 className="mb-2 text-xl font-semibold text-primary">Add New Expense</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleFormChange}
                className="rounded-lg bg-background p-3 text-primary shadow-md focus:outline-none"
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleFormChange}
                className="rounded-lg bg-background p-3 text-primary shadow-md focus:outline-none"
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={form.amount || ""}
                onChange={handleFormChange}
                className="rounded-lg bg-background p-3 text-primary shadow-md focus:outline-none"
              />
            </div>
            <input
              type="text"
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleFormChange}
              className="mt-4 w-full rounded-lg bg-background p-3 text-primary shadow-md focus:outline-none"
            />
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="flex transform items-center rounded-lg bg-secondary px-4 py-2 text-white shadow-md transition-transform hover:scale-105 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"
                onClick={() => {
                  setForm(emptyForm);
                  setShowForm(false);
                }}
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
              <button
                className="flex transform items-center rounded-lg bg-success px-4 py-2 text-white shadow-md transition-transform hover:scale-105 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-success focus:ring-opacity-50"
                onClick={addExpense}
              >
                <FaCheck className="mr-2" /> Save Expense
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
