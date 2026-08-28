"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaPen, FaTrash } from "react-icons/fa";
import { formatGBP } from "@/lib/format";
import type { Budget } from "@/lib/types";

interface BudgetManagerProps {
  budgets: Budget[];
  spendByCategory: Record<string, number>;
  knownCategories: string[];
}

function barColor(ratio: number): string {
  if (ratio > 1) return "bg-danger";
  if (ratio > 0.8) return "bg-warning";
  return "bg-success";
}

export default function BudgetManager({
  budgets,
  spendByCategory,
  knownCategories,
}: BudgetManagerProps) {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [busy, setBusy] = useState(false);

  const budgetedCategories = new Set(budgets.map((b) => b.category));
  const unbudgeted = Object.keys(spendByCategory)
    .filter((c) => !budgetedCategories.has(c))
    .sort();

  const save = async () => {
    if (!category.trim() || Number(limit) <= 0) return;
    setBusy(true);
    try {
      const res = await fetch("/api/budgets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: category.trim(), monthlyLimit: Number(limit) }),
      });
      if (res.ok) {
        setCategory("");
        setLimit("");
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };

  const startEdit = (b: Budget) => {
    setCategory(b.category);
    setLimit(String(b.monthlyLimit));
  };

  return (
    <div className="space-y-8">
      {/* Set / update a budget */}
      <section className="rounded-lg bg-surface p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-primary">Set a budget</h2>
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1 text-sm text-secondary">
            Category
            <input
              list="known-categories"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Groceries"
              className="rounded-lg bg-background p-3 text-primary shadow-md focus:outline-none"
            />
            <datalist id="known-categories">
              {knownCategories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
          <label className="flex flex-col gap-1 text-sm text-secondary">
            Monthly limit (£)
            <input
              type="number"
              min="0"
              step="0.01"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="0.00"
              className="rounded-lg bg-background p-3 text-primary shadow-md focus:outline-none"
            />
          </label>
          <button
            onClick={save}
            disabled={busy || !category.trim() || Number(limit) <= 0}
            className="flex items-center rounded-lg bg-primary px-4 py-3 text-white shadow-md transition-transform hover:scale-105 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaCheck className="mr-2" /> {busy ? "Saving…" : "Save budget"}
          </button>
        </div>
      </section>

      {/* Budget progress */}
      <section className="space-y-4 rounded-lg bg-surface p-6 shadow-md">
        <h2 className="text-xl font-semibold text-primary">This month</h2>
        {budgets.length === 0 && <p className="text-secondary">No budgets set yet.</p>}
        {budgets.map((b) => {
          const spent = spendByCategory[b.category] ?? 0;
          const ratio = spent / b.monthlyLimit;
          const remaining = b.monthlyLimit - spent;
          return (
            <div key={b.id} className="rounded-lg bg-background p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold">{b.category}</span>
                <span className="flex items-center gap-3 text-sm text-secondary">
                  {formatGBP(spent)} / {formatGBP(b.monthlyLimit)}
                  <button
                    aria-label={`Edit ${b.category} budget`}
                    onClick={() => startEdit(b)}
                    className="transition-colors hover:text-primary"
                  >
                    <FaPen />
                  </button>
                  <button
                    aria-label={`Delete ${b.category} budget`}
                    onClick={() => remove(b.id)}
                    className="transition-colors hover:text-danger"
                  >
                    <FaTrash />
                  </button>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded bg-surface">
                <div
                  className={`h-full rounded ${barColor(ratio)}`}
                  style={{ width: `${Math.min(100, ratio * 100)}%` }}
                />
              </div>
              <p
                className={`mt-1 text-sm ${remaining < 0 ? "text-danger" : "text-secondary"}`}
              >
                {remaining < 0
                  ? `${formatGBP(Math.abs(remaining))} over budget`
                  : `${formatGBP(remaining)} left`}
              </p>
            </div>
          );
        })}
      </section>

      {/* Unbudgeted spend */}
      {unbudgeted.length > 0 && (
        <section className="space-y-3 rounded-lg bg-surface p-6 shadow-md">
          <h2 className="text-xl font-semibold text-primary">Unbudgeted this month</h2>
          {unbudgeted.map((c) => (
            <div
              key={c}
              className="flex items-center justify-between rounded-lg bg-background p-3"
            >
              <span>{c}</span>
              <span className="flex items-center gap-3 text-secondary">
                {formatGBP(spendByCategory[c])}
                <button
                  onClick={() => {
                    setCategory(c);
                    setLimit("");
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  Set budget
                </button>
              </span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
