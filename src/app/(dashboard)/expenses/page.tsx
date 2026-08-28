"use client";

import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaSearch, FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import Button from "@/app/components/Button";
import Chart from "@/app/components/Chart";
import { formatGBP } from "@/lib/format";
import type { Expense, NewExpense } from "@/lib/types";

const emptyForm: NewExpense = {
  date: new Date().toISOString().slice(0, 10),
  category: "",
  amount: 0,
  notes: "",
  type: "expense",
};

const PALETTE = ["#4a00e0", "#8e2de2", "#00fff0", "#ffd700", "#ff4757", "#00ff9d"];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewExpense>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/expenses");
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data: Expense[] = await res.json();
        if (!cancelled) {
          setExpenses(data);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return expenses;
    return expenses.filter(
      (e) =>
        e.category.toLowerCase().includes(term) || e.notes.toLowerCase().includes(term),
    );
  }, [expenses, searchTerm]);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    const byCategory = new Map<string, number>();
    for (const e of expenses) {
      if (e.type === "income") {
        income += e.amount;
      } else {
        expense += e.amount;
        byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount);
      }
    }
    const ranked = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);
    return {
      income,
      expense,
      net: income - expense,
      topCategory: ranked[0],
      categoryLabels: ranked.map(([label]) => label),
      categoryValues: ranked.map(([, value]) => value),
    };
  }, [expenses]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const addExpense = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) return;
      const { expense }: { expense: Expense } = await res.json();
      setExpenses((prev) => [expense, ...prev]);
      setForm(emptyForm);
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const deleteExpense = async (id: string) => {
    const previous = expenses;
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    if (!res.ok) setExpenses(previous); // roll back on failure
  };

  return (
    <div className="expenses-page space-y-10">
      <header className="header flex items-center justify-between rounded-lg bg-surface p-6 shadow-lg">
        <h1 className="text-3xl font-semibold text-heading">Expenses Overview</h1>
      </header>

      {/* Overview Cards */}
      <section className="overview grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Expenses",
            value: formatGBP(totals.expense),
            color: "text-danger",
          },
          {
            label: "Total Income",
            value: formatGBP(totals.income),
            color: "text-success",
          },
          {
            label: "Net Balance",
            value: formatGBP(totals.net),
            color: totals.net >= 0 ? "text-success" : "text-danger",
          },
          {
            label: "Top Category",
            value: totals.topCategory
              ? `${totals.topCategory[0]}: ${formatGBP(totals.topCategory[1])}`
              : "—",
            color: "text-accent",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="stat-card rounded-lg bg-surface p-6 shadow-md transition-shadow hover:shadow-lg"
          >
            <h3 className="text-lg font-medium text-muted">{label}</h3>
            <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </section>

      {/* Expense By Category Chart Card */}
      <section className="chart-section rounded-lg bg-surface p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-heading">Expenses by Category</h2>
        {totals.categoryValues.length ? (
          <div className="mx-auto max-w-md">
            <Chart
              kind="doughnut"
              labels={totals.categoryLabels}
              values={totals.categoryValues}
              palette={PALETTE}
            />
          </div>
        ) : (
          <p className="text-muted">No expense data yet.</p>
        )}
      </section>

      {/* Expense List */}
      <section className="expense-list space-y-6 rounded-lg bg-surface p-8 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-heading">Expense List</h2>
          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search expenses..."
                className="rounded-lg bg-elevated p-3 pr-9 text-heading shadow-md focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute right-3 text-muted" />
            </div>
            <Button onClick={() => setShowForm((v) => !v)}>
              <FaPlus /> Add New Expense
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="add-expense-section space-y-4 rounded-lg bg-elevated p-6 shadow-inner">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleFormChange}
                className="rounded-lg bg-surface p-3 text-heading shadow-md focus:outline-none"
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleFormChange}
                className="rounded-lg bg-surface p-3 text-heading shadow-md focus:outline-none"
              />
              <input
                type="number"
                name="amount"
                min="0"
                step="0.01"
                placeholder="Amount (£)"
                value={form.amount || ""}
                onChange={handleFormChange}
                className="rounded-lg bg-surface p-3 text-heading shadow-md focus:outline-none"
              />
              <select
                name="type"
                value={form.type}
                onChange={handleFormChange}
                className="rounded-lg bg-surface p-3 text-heading shadow-md focus:outline-none"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <input
              type="text"
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleFormChange}
              className="w-full rounded-lg bg-surface p-3 text-heading shadow-md focus:outline-none"
            />
            <div className="flex justify-end gap-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setForm(emptyForm);
                  setShowForm(false);
                }}
              >
                <FaTimes /> Cancel
              </Button>
              <Button
                disabled={saving || !form.category || form.amount <= 0}
                onClick={addExpense}
              >
                <FaCheck /> {saving ? "Saving…" : "Save Expense"}
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead>
              <tr className="bg-brand text-white">
                <th className="border-b border-border p-3">Date</th>
                <th className="border-b border-border p-3">Category</th>
                <th className="border-b border-border p-3">Amount</th>
                <th className="border-b border-border p-3">Notes</th>
                <th className="border-b border-border p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {status === "loading" && (
                <tr>
                  <td className="p-3 text-center text-muted" colSpan={5}>
                    Loading…
                  </td>
                </tr>
              )}
              {status === "error" && (
                <tr>
                  <td className="p-3 text-center text-danger" colSpan={5}>
                    Could not load expenses.
                  </td>
                </tr>
              )}
              {status === "ready" && filtered.length === 0 && (
                <tr>
                  <td className="p-3 text-center text-muted" colSpan={5}>
                    No expenses found.
                  </td>
                </tr>
              )}
              {status === "ready" &&
                filtered.map((expense) => (
                  <tr key={expense.id} className="transition-colors hover:bg-elevated">
                    <td className="border-b border-border p-3">{expense.date}</td>
                    <td className="border-b border-border p-3">{expense.category}</td>
                    <td
                      className={`border-b border-border p-3 font-semibold ${
                        expense.type === "income" ? "text-success" : "text-danger"
                      }`}
                    >
                      {expense.type === "income" ? "+ " : "- "}
                      {formatGBP(expense.amount)}
                    </td>
                    <td className="border-b border-border p-3">{expense.notes}</td>
                    <td className="border-b border-border p-3 text-right">
                      <button
                        aria-label={`Delete ${expense.category} entry`}
                        onClick={() => deleteExpense(expense.id)}
                        className="text-muted transition-colors hover:text-danger"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
