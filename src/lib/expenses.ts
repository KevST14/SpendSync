import { Prisma, type Expense as ExpenseRow } from "@prisma/client";
import { prisma } from "./prisma";
import type { Expense, ExpenseType } from "./types";
import type { CreateExpenseInput, UpdateExpenseInput } from "./validation";

/** Prisma row -> plain JSON shape used by the API and UI. */
function serialize(row: ExpenseRow): Expense {
  return {
    id: row.id,
    date: row.date.toISOString().slice(0, 10),
    amount: row.amount.toNumber(),
    category: row.category,
    notes: row.notes,
    type: row.type === "INCOME" ? "income" : "expense",
  };
}

function toDbType(type: ExpenseType): "EXPENSE" | "INCOME" {
  return type === "income" ? "INCOME" : "EXPENSE";
}

export async function listExpenses(): Promise<Expense[]> {
  const rows = await prisma.expense.findMany({
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(serialize);
}

export async function createExpense(input: CreateExpenseInput): Promise<Expense> {
  const row = await prisma.expense.create({
    data: {
      date: new Date(input.date),
      amount: input.amount,
      category: input.category,
      notes: input.notes,
      type: toDbType(input.type),
    },
  });
  return serialize(row);
}

export async function updateExpense(
  id: string,
  input: UpdateExpenseInput,
): Promise<Expense | null> {
  const data: Prisma.ExpenseUpdateInput = {};
  if (input.date !== undefined) data.date = new Date(input.date);
  if (input.amount !== undefined) data.amount = input.amount;
  if (input.category !== undefined) data.category = input.category;
  if (input.notes !== undefined) data.notes = input.notes;
  if (input.type !== undefined) data.type = toDbType(input.type);

  try {
    const row = await prisma.expense.update({ where: { id }, data });
    return serialize(row);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return null; // record not found
    }
    throw error;
  }
}

export async function deleteExpense(id: string): Promise<boolean> {
  try {
    await prisma.expense.delete({ where: { id } });
    return true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return false; // record not found
    }
    throw error;
  }
}
