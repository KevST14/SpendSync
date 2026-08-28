"use client";

import { useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import Button from "./Button";
import type { NewExpense } from "@/lib/types";

interface ExpenseFormProps {
  initial: NewExpense;
  editing: boolean;
  submitting: boolean;
  onSubmit: (value: NewExpense) => void;
  onCancel: () => void;
}

const field =
  "rounded-lg bg-surface p-3 text-heading focus:outline-none border border-border";

export default function ExpenseForm({
  initial,
  editing,
  submitting,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  const [form, setForm] = useState<NewExpense>(initial);

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const valid =
    form.category.trim().length > 0 &&
    form.amount > 0 &&
    /^\d{4}-\d{2}-\d{2}$/.test(form.date);

  return (
    <div className="space-y-4 rounded-lg bg-elevated p-6">
      <h3 className="font-semibold text-heading">
        {editing ? "Edit entry" : "Add new entry"}
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={change}
          className={field}
        />
        <input
          type="text"
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
        <select name="type" value={form.type} onChange={change} className={field}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <input
        type="text"
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={change}
        className={`${field} w-full`}
      />
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>
          <FaTimes /> Cancel
        </Button>
        <Button disabled={submitting || !valid} onClick={() => onSubmit(form)}>
          <FaCheck /> {submitting ? "Saving…" : editing ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
}
