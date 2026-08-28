import { NextResponse } from "next/server";
import type { Expense, NewExpense } from "@/lib/types";

// Temporary in-memory store for expenses (replaced by Prisma + Postgres in Phase 4).
const expenses: Expense[] = [
  { date: "2024-06-01", category: "Groceries", amount: 150, notes: "Weekly shopping" },
  { date: "2024-06-02", category: "Utilities", amount: 80, notes: "Electricity bill" },
  { date: "2024-06-03", category: "Entertainment", amount: 50, notes: "Movie night" },
];

export async function GET() {
  return NextResponse.json(expenses);
}

export async function POST(request: Request) {
  const newExpense = (await request.json()) as NewExpense;
  expenses.push(newExpense);
  return NextResponse.json({
    message: "Expense added successfully",
    expense: newExpense,
  });
}
