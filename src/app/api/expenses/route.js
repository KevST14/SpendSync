// app/api/expenses/route.js

import { NextResponse } from 'next/server';

// Temporary in-memory store for expenses (replace with a database in production)
let expenses = [
  { date: "2024-06-01", category: "Groceries", amount: 150, notes: "Weekly shopping" },
  { date: "2024-06-02", category: "Utilities", amount: 80, notes: "Electricity bill" },
  { date: "2024-06-03", category: "Entertainment", amount: 50, notes: "Movie night" },
];

export async function GET() {
  return NextResponse.json(expenses);
}

export async function POST(request) {
  const newExpense = await request.json();
  expenses.push(newExpense); // Add new expense to the array
  return NextResponse.json({ message: 'Expense added successfully', expense: newExpense });
}
