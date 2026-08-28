import { Prisma, type Budget as BudgetRow } from "@prisma/client";
import { prisma } from "./prisma";
import type { Budget } from "./types";
import type { BudgetInput } from "./validation";

function serialize(row: BudgetRow): Budget {
  return {
    id: row.id,
    category: row.category,
    monthlyLimit: row.monthlyLimit.toNumber(),
  };
}

export async function listBudgets(): Promise<Budget[]> {
  const rows = await prisma.budget.findMany({ orderBy: { category: "asc" } });
  return rows.map(serialize);
}

/** Create or update the budget for a category (category is unique). */
export async function upsertBudget(input: BudgetInput): Promise<Budget> {
  const row = await prisma.budget.upsert({
    where: { category: input.category },
    create: { category: input.category, monthlyLimit: input.monthlyLimit },
    update: { monthlyLimit: input.monthlyLimit },
  });
  return serialize(row);
}

export async function deleteBudget(id: string): Promise<boolean> {
  try {
    await prisma.budget.delete({ where: { id } });
    return true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return false; // record not found
    }
    throw error;
  }
}
