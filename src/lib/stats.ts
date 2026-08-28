import type { Expense } from "./types";

export interface CategorySlice {
  label: string;
  value: number;
}

export interface MonthPoint {
  month: string; // short label, e.g. "Aug 26"
  value: number;
}

export interface MonthlyPoint {
  month: string;
  income: number;
  expense: number;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  net: number;
  transactionCount: number;
  topCategory: CategorySlice | null;
  /** Expense totals per category, largest first. */
  byCategory: CategorySlice[];
  /** Chronological, at most the last 6 months that have data. */
  monthly: MonthlyPoint[];
  /** Most recent entries, newest first. */
  recent: Expense[];
}

const monthLabel = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "2-digit",
});

export function sum(entries: Expense[]): number {
  return entries.reduce((total, entry) => total + entry.amount, 0);
}

export function sumByCategory(entries: Expense[]): CategorySlice[] {
  const totals = new Map<string, number>();
  for (const entry of entries) {
    totals.set(entry.category, (totals.get(entry.category) ?? 0) + entry.amount);
  }
  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export function sumByMonth(entries: Expense[]): MonthPoint[] {
  const totals = new Map<string, MonthPoint>();
  for (const entry of entries) {
    const key = entry.date.slice(0, 7);
    const point =
      totals.get(key) ??
      ({ month: monthLabel.format(new Date(entry.date)), value: 0 } satisfies MonthPoint);
    point.value += entry.amount;
    totals.set(key, point);
  }
  return [...totals.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, point]) => point);
}

export function computeStats(expenses: Expense[]): DashboardStats {
  const income = expenses.filter((entry) => entry.type === "income");
  const spend = expenses.filter((entry) => entry.type !== "income");

  const totalIncome = sum(income);
  const totalExpense = sum(spend);
  const byCategory = sumByCategory(spend);

  const monthMap = new Map<string, MonthlyPoint>();
  for (const entry of expenses) {
    const key = entry.date.slice(0, 7);
    const point =
      monthMap.get(key) ??
      ({
        month: monthLabel.format(new Date(entry.date)),
        income: 0,
        expense: 0,
      } satisfies MonthlyPoint);
    if (entry.type === "income") point.income += entry.amount;
    else point.expense += entry.amount;
    monthMap.set(key, point);
  }
  const monthly = [...monthMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, point]) => point)
    .slice(-6);

  const recent = [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return {
    totalIncome,
    totalExpense,
    net: totalIncome - totalExpense,
    transactionCount: expenses.length,
    topCategory: byCategory[0] ?? null,
    byCategory,
    monthly,
    recent,
  };
}
