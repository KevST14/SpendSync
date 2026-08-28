"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import Button from "./Button";
import Skeleton from "./Skeleton";
import { useToast } from "./Toast";
import { formatGBP } from "@/lib/format";
import type { NewSavingsGoal, SavingsGoal } from "@/lib/types";

const field =
  "rounded-lg border border-border bg-elevated p-2.5 text-heading focus:outline-none";

const blankForm = (): NewSavingsGoal => ({ name: "", target: 0, targetDate: null });

function GoalRow({
  goal,
  onContribute,
  onDelete,
}: {
  goal: SavingsGoal;
  onContribute: (id: string, amount: number) => void;
  onDelete: (id: string) => void;
}) {
  const [amount, setAmount] = useState("");
  const pct = goal.target > 0 ? (goal.saved / goal.target) * 100 : 0;
  const done = pct >= 100;

  return (
    <div className="space-y-3 rounded-lg bg-elevated p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold">{goal.name}</span>
        <span className="flex items-center gap-3 text-sm text-muted">
          {formatGBP(goal.saved)} / {formatGBP(goal.target)}
          {goal.targetDate && <span>by {goal.targetDate}</span>}
          <button
            aria-label={`Delete ${goal.name} goal`}
            onClick={() => onDelete(goal.id)}
            className="transition-colors hover:text-danger"
          >
            <FaTrash />
          </button>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded bg-surface">
        <div
          className={`h-full rounded ${done ? "bg-success" : "bg-brand"}`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted">{Math.round(pct)}% saved</span>
        <div className="ml-auto flex items-center gap-2">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`${field} w-28 py-1.5`}
          />
          <Button
            className="px-3 py-1.5"
            disabled={Number(amount) <= 0}
            onClick={() => {
              onContribute(goal.id, Number(amount));
              setAmount("");
            }}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function GoalsManager() {
  const { toast } = useToast();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewSavingsGoal>(blankForm());
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/goals");
      if (!res.ok) throw new Error();
      setGoals(await res.json());
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          target: form.target,
          targetDate: form.targetDate || null,
        }),
      });
      if (!res.ok) {
        toast("Could not save the goal.", "error");
        return;
      }
      const { goal }: { goal: SavingsGoal } = await res.json();
      setGoals((prev) => [...prev, goal]);
      setForm(blankForm());
      setShowForm(false);
      toast("Goal added.");
    } finally {
      setBusy(false);
    }
  };

  const contribute = async (id: string, amount: number) => {
    const res = await fetch(`/api/goals/${id}/contribute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    if (res.ok) {
      const { goal }: { goal: SavingsGoal } = await res.json();
      setGoals((prev) => prev.map((g) => (g.id === goal.id ? goal : g)));
      toast(`Added ${formatGBP(amount)}.`);
    } else {
      toast("Could not add the contribution.", "error");
    }
  };

  const remove = async (id: string) => {
    const prev = goals;
    setGoals((g) => g.filter((x) => x.id !== id));
    const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
    if (res.ok) toast("Goal removed.");
    else {
      setGoals(prev);
      toast("Could not remove the goal.", "error");
    }
  };

  const valid = form.name.trim() && form.target > 0;

  return (
    <section className="space-y-5 rounded-lg bg-surface p-6 shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-heading">Goals</h2>
        <Button onClick={() => setShowForm((v) => !v)}>
          <FaPlus /> Add goal
        </Button>
      </div>

      {showForm && (
        <div className="space-y-4 rounded-lg bg-elevated p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <input
              placeholder="Goal name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={field}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Target (£)"
              value={form.target || ""}
              onChange={(e) => setForm((f) => ({ ...f, target: Number(e.target.value) }))}
              className={field}
            />
            <input
              type="date"
              value={form.targetDate ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, targetDate: e.target.value || null }))
              }
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
              {busy ? "Saving…" : "Save goal"}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {status === "loading" &&
          Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        {status === "error" && <p className="text-danger">Could not load goals.</p>}
        {status === "ready" && goals.length === 0 && (
          <p className="text-muted">No savings goals yet.</p>
        )}
        {status === "ready" &&
          goals.map((goal) => (
            <GoalRow
              key={goal.id}
              goal={goal}
              onContribute={contribute}
              onDelete={remove}
            />
          ))}
      </div>
    </section>
  );
}
