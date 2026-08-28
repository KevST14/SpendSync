/**
 * Shared domain types.
 *
 * These mirror the current mock API shape. Phase 4 replaces the mock store
 * with Prisma + Postgres, at which point `Expense` gains `id` and `type`
 * fields and this file re-exports the generated Prisma types.
 */

export interface Expense {
  date: string; // ISO date, yyyy-mm-dd
  category: string;
  amount: number;
  notes: string;
}

export type NewExpense = Expense;
