"use client";

import { useEffect, useMemo, useState } from "react";
import { FaPen, FaPlus, FaSort, FaSortDown, FaSortUp, FaTrash } from "react-icons/fa";
import Button from "@/app/components/Button";
import Chart from "@/app/components/Chart";
import ExpenseForm from "@/app/components/ExpenseForm";
import Skeleton from "@/app/components/Skeleton";
import { useToast } from "@/app/components/Toast";
import { formatGBP } from "@/lib/format";
import { sumByCategory } from "@/lib/stats";
import type { Expense, NewExpense } from "@/lib/types";

const PALETTE = ["#6a34e8", "#8e2de2", "#00e0d0", "#ffce3d", "#ff5a68", "#14e0a0"];

const blankForm = (): NewExpense => ({
  date: new Date().toISOString().slice(0, 10),
  category: "",
  amount: 0,
  notes: "",
  type: "expense",
});

type SortKey = "date" | "category" | "amount";

export default function ExpensesPage() {
  const { toast } = useToast();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [saving, setSaving] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "expense" | "income">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "date",
    dir: "desc",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/expenses");
        if (!res.ok) throw new Error(String(res.status));
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

  const categories = useMemo(
    () => [...new Set(expenses.map((e) => e.category))].sort(),
    [expenses],
  );

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = expenses.filter((e) => {
      if (typeFilter !== "all" && e.type !== typeFilter) return false;
      if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
      if (from && e.date < from) return false;
      if (to && e.date > to) return false;
      if (
        term &&
        !e.category.toLowerCase().includes(term) &&
        !e.notes.toLowerCase().includes(term)
      )
        return false;
      return true;
    });
    const factor = sort.dir === "asc" ? 1 : -1;
    return filtered.sort((a, b) => {
      if (sort.key === "amount") return (a.amount - b.amount) * factor;
      return a[sort.key].localeCompare(b[sort.key]) * factor;
    });
  }, [expenses, search, typeFilter, categoryFilter, from, to, sort]);

  const chart = useMemo(
    () => sumByCategory(visible.filter((e) => e.type !== "income")),
    [visible],
  );

  const toggleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "amount" || key === "date" ? "desc" : "asc" },
    );
  };

  const sortIcon = (key: SortKey) => {
    if (sort.key !== key) return <FaSort className="opacity-40" />;
    return sort.dir === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (expense: Expense) => {
    setEditing(expense);
    setFormOpen(true);
  };

  const submit = async (value: NewExpense) => {
    setSaving(true);
    try {
      const res = await fetch(editing ? `/api/expenses/${editing.id}` : "/api/expenses", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      if (!res.ok) {
        toast("Could not save the entry.", "error");
        return;
      }
      const { expense }: { expense: Expense } = await res.json();
      setExpenses((prev) =>
        editing
          ? prev.map((e) => (e.id === expense.id ? expense : e))
          : [expense, ...prev],
      );
      toast(editing ? "Entry updated." : "Entry added.");
      setFormOpen(false);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (expense: Expense) => {
    const previous = expenses;
    setExpenses((prev) => prev.filter((e) => e.id !== expense.id));
    const res = await fetch(`/api/expenses/${expense.id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Entry deleted.");
    } else {
      setExpenses(previous);
      toast("Could not delete the entry.", "error");
    }
  };

  return (
    <div className="space-y-10">
      <header className="header rounded-lg bg-surface p-6 shadow-md">
        <h1 className="text-3xl font-semibold text-heading">Expenses</h1>
      </header>

      <section className="rounded-lg bg-surface p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-heading">Spend by Category</h2>
        {chart.length ? (
          <div className="mx-auto max-w-md">
            <Chart
              kind="doughnut"
              labels={chart.map((c) => c.label)}
              values={chart.map((c) => c.value)}
              palette={PALETTE}
            />
          </div>
        ) : (
          <p className="text-muted">No expenses match the current filters.</p>
        )}
      </section>

      <section className="space-y-5 rounded-lg bg-surface p-6 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-heading">Transactions</h2>
          <Button onClick={formOpen && !editing ? () => setFormOpen(false) : openAdd}>
            <FaPlus /> Add entry
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-border bg-elevated p-2.5 text-heading focus:outline-none"
          />
          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as "all" | "expense" | "income")
            }
            className="rounded-lg border border-border bg-elevated p-2.5 text-heading focus:outline-none"
          >
            <option value="all">All types</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-border bg-elevated p-2.5 text-heading focus:outline-none"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            aria-label="From date"
            className="rounded-lg border border-border bg-elevated p-2.5 text-heading focus:outline-none"
          />
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            aria-label="To date"
            className="rounded-lg border border-border bg-elevated p-2.5 text-heading focus:outline-none"
          />
        </div>

        {formOpen && (
          <ExpenseForm
            key={editing?.id ?? "new"}
            editing={Boolean(editing)}
            submitting={saving}
            initial={
              editing
                ? {
                    date: editing.date,
                    category: editing.category,
                    amount: editing.amount,
                    notes: editing.notes,
                    type: editing.type,
                  }
                : blankForm()
            }
            onSubmit={submit}
            onCancel={() => {
              setFormOpen(false);
              setEditing(null);
            }}
          />
        )}

        <div className="overflow-x-auto rounded-lg">
          <table className="w-full min-w-[44rem] text-left">
            <thead>
              <tr className="bg-brand text-white">
                {(
                  [
                    ["date", "Date"],
                    ["category", "Category"],
                    ["amount", "Amount"],
                  ] as [SortKey, string][]
                ).map(([key, label]) => (
                  <th key={key} className="p-3">
                    <button
                      onClick={() => toggleSort(key)}
                      className="inline-flex items-center gap-1.5"
                    >
                      {label} {sortIcon(key)}
                    </button>
                  </th>
                ))}
                <th className="p-3">Notes</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {status === "loading" &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="p-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))}
              {status === "error" && (
                <tr>
                  <td className="p-4 text-center text-danger" colSpan={5}>
                    Could not load expenses.
                  </td>
                </tr>
              )}
              {status === "ready" && visible.length === 0 && (
                <tr>
                  <td className="p-4 text-center text-muted" colSpan={5}>
                    Nothing matches these filters.
                  </td>
                </tr>
              )}
              {status === "ready" &&
                visible.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-border transition-colors hover:bg-elevated"
                  >
                    <td className="p-3">{expense.date}</td>
                    <td className="p-3">{expense.category}</td>
                    <td
                      className={`p-3 font-semibold ${
                        expense.type === "income" ? "text-success" : "text-danger"
                      }`}
                    >
                      {expense.type === "income" ? "+ " : "- "}
                      {formatGBP(expense.amount)}
                    </td>
                    <td className="p-3 text-muted">{expense.notes}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-3">
                        <button
                          aria-label={`Edit ${expense.category} entry`}
                          onClick={() => openEdit(expense)}
                          className="text-muted transition-colors hover:text-brand"
                        >
                          <FaPen />
                        </button>
                        <button
                          aria-label={`Delete ${expense.category} entry`}
                          onClick={() => remove(expense)}
                          className="text-muted transition-colors hover:text-danger"
                        >
                          <FaTrash />
                        </button>
                      </div>
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
