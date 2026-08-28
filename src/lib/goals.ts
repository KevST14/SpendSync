import { Prisma, type SavingsGoal as GoalRow } from "@prisma/client";
import { prisma } from "./prisma";
import type { SavingsGoal } from "./types";
import type { GoalInput, UpdateGoalInput } from "./validation";

const pad = (n: number) => String(n).padStart(2, "0");
const isoDate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function serialize(row: GoalRow): SavingsGoal {
  return {
    id: row.id,
    name: row.name,
    target: row.target.toNumber(),
    saved: row.saved.toNumber(),
    targetDate: row.targetDate ? isoDate(row.targetDate) : null,
  };
}

const notFound = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";

export async function listGoals(): Promise<SavingsGoal[]> {
  const rows = await prisma.savingsGoal.findMany({
    orderBy: { createdAt: "asc" },
  });
  return rows.map(serialize);
}

export async function createGoal(input: GoalInput): Promise<SavingsGoal> {
  const row = await prisma.savingsGoal.create({
    data: {
      name: input.name,
      target: input.target,
      targetDate: input.targetDate ? new Date(input.targetDate) : null,
    },
  });
  return serialize(row);
}

export async function updateGoal(
  id: string,
  input: UpdateGoalInput,
): Promise<SavingsGoal | null> {
  const data: Prisma.SavingsGoalUpdateInput = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.target !== undefined) data.target = input.target;
  if (input.targetDate !== undefined)
    data.targetDate = input.targetDate ? new Date(input.targetDate) : null;

  try {
    return serialize(await prisma.savingsGoal.update({ where: { id }, data }));
  } catch (error) {
    if (notFound(error)) return null;
    throw error;
  }
}

export async function contributeToGoal(
  id: string,
  amount: number,
): Promise<SavingsGoal | null> {
  try {
    return serialize(
      await prisma.savingsGoal.update({
        where: { id },
        data: { saved: { increment: amount } },
      }),
    );
  } catch (error) {
    if (notFound(error)) return null;
    throw error;
  }
}

export async function deleteGoal(id: string): Promise<boolean> {
  try {
    await prisma.savingsGoal.delete({ where: { id } });
    return true;
  } catch (error) {
    if (notFound(error)) return false;
    throw error;
  }
}
