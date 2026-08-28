"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaDownload, FaTrashRestore } from "react-icons/fa";
import Button from "./Button";
import ThemeControl from "./ThemeControl";
import { useToast } from "./Toast";
import type { Expense } from "@/lib/types";

export default function SettingsForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  const saveName = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: name.trim() }),
      });
      if (res.ok) {
        toast("Profile saved.");
        router.refresh();
      } else {
        toast("Could not save your profile.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = async () => {
    const res = await fetch("/api/expenses");
    const rows: Expense[] = await res.json();
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = [
      "date,type,category,amount,notes",
      ...rows.map((r) =>
        [r.date, r.type, escape(r.category), r.amount, escape(r.notes)].join(","),
      ),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "spendsync-export.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast(`Exported ${rows.length} transactions.`);
  };

  const resetDemo = async () => {
    if (!window.confirm("Replace all data with the demo dataset?")) return;
    setResetting(true);
    try {
      const res = await fetch("/api/demo/reset", { method: "POST" });
      if (res.ok) {
        toast("Demo data restored.");
        router.refresh();
      } else {
        toast("Could not reset demo data.", "error");
      }
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-lg bg-surface p-6 shadow-md">
        <h2 className="text-xl font-semibold text-heading">Profile</h2>
        <label className="flex max-w-sm flex-col gap-1 text-sm text-muted">
          Display name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            className="rounded-lg bg-elevated p-3 text-heading focus:outline-none"
          />
        </label>
        <Button
          onClick={saveName}
          disabled={saving || !name.trim() || name.trim() === initialName}
        >
          {saving ? "Saving…" : "Save"}
        </Button>
      </section>

      <section className="space-y-4 rounded-lg bg-surface p-6 shadow-md">
        <h2 className="text-xl font-semibold text-heading">Appearance</h2>
        <p className="text-sm text-muted">Theme</p>
        <ThemeControl />
      </section>

      <section className="space-y-4 rounded-lg bg-surface p-6 shadow-md">
        <h2 className="text-xl font-semibold text-heading">Data</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" onClick={exportCsv}>
            <FaDownload /> Export transactions (CSV)
          </Button>
          <Button variant="danger" onClick={resetDemo} disabled={resetting}>
            <FaTrashRestore /> {resetting ? "Resetting…" : "Reset demo data"}
          </Button>
        </div>
      </section>
    </div>
  );
}
