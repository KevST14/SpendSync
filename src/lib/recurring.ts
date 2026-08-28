import {
  Prisma,
  type RecurringRule as RecurringRow,
  type Frequency as DbFrequency,
} from "@prisma/client";
import { prisma } from "./prisma";
import type { Expense, Frequency, RecurringRule } from "./types";
import type { RecurringInput, UpdateRecurringInput } from "./validation";
import { createExpense } from "./expenses";

const pad = (n: number) => String(n).padStart(2, "0");
const isoDate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function serialize(row: RecurringRow): RecurringRule {
  return {
    id: row.id,
    category: row.category,
    amount: row.amount.toNumber(),
    notes: row.notes,
    type: row.type === "INCOME" ? "income" : "expense",
    frequency: row.frequency === "WEEKLY" ? "weekly" : "monthly",
    nextDate: isoDate(row.nextDate),
  };
}

const toDbType = (t: "expense" | "income") => (t === "income" ? "INCOME" : "EXPENSE");
const toDbFreq = (f: Frequency): DbFrequency => (f === "weekly" ? "WEEKLY" : "MONTHLY");

function advance(date: Date, freq: DbFrequency): Date {
  const next = new Date(date);
  if (freq === "WEEKLY") next.setDate(next.getDate() + 7);
  else next.setMonth(next.getMonth() + 1);
  return next;
}

export async function listRecurring(): Promise<RecurringRule[]> {
  const rows = await prisma.recurringRule.findMany({
    orderBy: { nextDate: "asc" },
  });
  return rows.map(serialize);
}

export async function createRecurring(input: RecurringInput): Promise<RecurringRule> {
  const row = await prisma.recurringRule.create({
    data: {
      category: input.category,
      amount: input.amount,
      notes: input.notes,
      type: toDbType(input.type),
      frequency: toDbFreq(input.frequency),
      nextDate: new Date(input.nextDate),
    },
  });
  return serialize(row);
}

export async function updateRecurring(
  id: string,
  input: UpdateRecurringInput,
): Promise<RecurringRule | null> {
  const data: Prisma.RecurringRuleUpdateInput = {};
  if (input.category !== undefined) data.category = input.category;
  if (input.amount !== undefined) data.amount = input.amount;
  if (input.notes !== undefined) data.notes = input.notes;
  if (input.type !== undefined) data.type = toDbType(input.type);
  if (input.frequency !== undefined) data.frequency = toDbFreq(input.frequency);
  if (input.nextDate !== undefined) data.nextDate = new Date(input.nextDate);

  try {
    const row = await prisma.recurringRule.update({ where: { id }, data });
    return serialize(row);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return null;
    }
    throw error;
  }
}

export async function deleteRecurring(id: string): Promise<boolean> {
  try {
    await prisma.recurringRule.delete({ where: { id } });
    return true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return false;
    }
    throw error;
  }
}

/** Materialise one occurrence: create the expense, advance nextDate. */
export async function postRecurring(
  id: string,
): Promise<{ expense: Expense; rule: RecurringRule } | null> {
  const row = await prisma.recurringRule.findUnique({ where: { id } });
  if (!row) return null;

  const expense = await createExpense({
    date: isoDate(row.nextDate),
    amount: row.amount.toNumber(),
    category: row.category,
    notes: row.notes,
    type: row.type === "INCOME" ? "income" : "expense",
  });

  const updated = await prisma.recurringRule.update({
    where: { id },
    data: { nextDate: advance(row.nextDate, row.frequency) },
  });

  return { expense, rule: serialize(updated) };
}

/** Post every rule whose nextDate is on or before today (catching up). */
export async function postAllDue(): Promise<number> {
  const today = isoDate(new Date());
  let posted = 0;

  for (let guard = 0; guard < 60; guard++) {
    const due = await prisma.recurringRule.findMany({
      where: { nextDate: { lte: new Date(today) } },
      orderBy: { nextDate: "asc" },
      take: 1,
    });
    if (due.length === 0) break;
    await postRecurring(due[0].id);
    posted++;
  }
  return posted;
}
