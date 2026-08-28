"use client";

import { useEffect, useMemo, useState } from "react";
import { FaPlay, FaPlus, FaTrash } from "react-icons/fa";
import Button from "./Button";
import Skeleton from "./Skeleton";
import { useToast } from "./Toast";
import { formatGBP } from "@/lib/format";
import type { NewRecurringRule, RecurringRule } from "@/lib/types";

const field =
  "rounded-lg border border-border bg-elevated p-2.5 text-heading focus:outline-none";

const blankForm = (): NewRecurringRule => ({
  category: "",
  amount: 0,
  notes: "",
  type: "expense",
  frequency: "monthly",
  nextDate: new Date().toISOString().slice(0, 10),
});

const todayIso = new Date().toISOString().slice(0, 10);

export default function RecurringManager() {
  const { toast } = useToast();
  const [rules, setRules] = useState<RecurringRule[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewRecurringRule>(blankForm());
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/recurring");
      if (!res.ok) throw new Error();
      setRules(await res.json());
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const dueCount = useMemo(
    () => rules.filter((r) => r.nextDate <= todayIso).length,
    [rules],
  );

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const valid =
    form.category.trim() && form.amount > 0 && /^\d{4}-\d{2}-\d{2}$/.test(form.nextDate);

  const create = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/recurring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        toast("Could not save the rule.", "error");
        return;
      }
      const { rule }: { rule: RecurringRule } = await res.json();
      setRules((prev) =>
        [...prev, rule].sort((a, b) => a.nextDate.localeCompare(b.nextDate)),
      );
      setForm(blankForm());
      setShowForm(false);
      toast("Recurring rule added.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    const prev = rules;
    setRules((r) => r.filter((x) => x.id !== id));
    const res = await fetch(`/api/recurring/${id}`, { method: "DELETE" });
    if (res.ok) toast("Rule removed.");
    else {
      setRules(prev);
      toast("Could not remove the rule.", "error");
    }
  };

  const post = async (id: string) => {
    const res = await fetch(`/api/recurring/${id}/post`, { method: "POST" });
    if (res.ok) {
      toast("Transaction posted.");
      load();
    } else {
      toast("Could not post the transaction.", "error");
    }
  };

  const postDue = async () => {
    const res = await fetch("/api/recurring/post-due", { method: "POST" });
    if (res.ok) {
      const { posted } = await res.json();
      toast(posted ? `Posted ${posted} transaction(s).` : "Nothing due.");
      load();
    } else {
      toast("Could not post due transactions.", "error");
    }
  };

  return (
    <div className="space-y-6">
      <section className="space-y-5 rounded-lg bg-surface p-6 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-heading">Rules</h2>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={postDue} disabled={dueCount === 0}>
              <FaPlay /> Post due{dueCount ? ` (${dueCount})` : ""}
            </Button>
            <Button onClick={() => setShowForm((v) => !v)}>
              <FaPlus /> Add rule
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="space-y-4 rounded-lg bg-elevated p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <input
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={change}
                className={field}
              />
              <input
                type="number"
                name="amount"
                min="0"
                step="0.01"
                placeholder="Amount (£)"
                value={form.amount || ""}
                onChange={change}
                className={field}
              />
              <input
                type="date"
                name="nextDate"
                value={form.nextDate}
                onChange={change}
                className={field}
              />
              <select name="type" value={form.type} onChange={change} className={field}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <select
                name="frequency"
                value={form.frequency}
                onChange={change}
                className={field}
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
              <input
                name="notes"
                placeholder="Notes"
                value={form.notes}
                onChange={change}
                className={field}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setForm(blankForm());
                  setShowForm(false);
                }}
              >
                Cancel
              </Button>
              <Button disabled={busy || !valid} onClick={create}>
                {busy ? "Saving…" : "Save rule"}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {status === "loading" &&
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          {status === "error" && (
            <p className="text-danger">Could not load recurring rules.</p>
          )}
          {status === "ready" && rules.length === 0 && (
            <p className="text-muted">No recurring rules yet.</p>
          )}
          {status === "ready" &&
            rules.map((rule) => {
              const due = rule.nextDate <= todayIso;
              return (
                <div
                  key={rule.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-elevated p-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{rule.category}</span>
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs capitalize text-muted">
                        {rule.frequency}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      Next: {rule.nextDate}
                      {due && <span className="ml-2 text-warning">due</span>}
                      {rule.notes ? ` · ${rule.notes}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-semibold ${
                        rule.type === "income" ? "text-success" : "text-danger"
                      }`}
                    >
                      {rule.type === "income" ? "+ " : "- "}
                      {formatGBP(rule.amount)}
                    </span>
                    <button
                      aria-label={`Post ${rule.category} now`}
                      onClick={() => post(rule.id)}
                      className="text-muted transition-colors hover:text-brand"
                    >
                      <FaPlay />
                    </button>
                    <button
                      aria-label={`Delete ${rule.category} rule`}
                      onClick={() => remove(rule.id)}
                      className="text-muted transition-colors hover:text-danger"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}
