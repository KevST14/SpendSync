/**
 * Shared domain types — the shape the API and UI exchange.
 *
 * These are the serialized form of the Prisma `Expense` row: `date` is a
 * `yyyy-mm-dd` string and `amount` is a plain number (pounds), so responses
 * are plain JSON with no Date or Decimal instances.
 */

export type ExpenseType = "expense" | "income";

export interface Expense {
  id: string;
  date: string; // ISO date, yyyy-mm-dd
  amount: number; // pounds
  category: string;
  notes: string;
  type: ExpenseType;
}

export type NewExpense = Omit<Expense, "id">;

export interface Budget {
  id: string;
  category: string;
  monthlyLimit: number; // pounds
}

export type NewBudget = Omit<Budget, "id">;

export type Frequency = "weekly" | "monthly";

export interface RecurringRule {
  id: string;
  category: string;
  amount: number; // pounds
  notes: string;
  type: ExpenseType;
  frequency: Frequency;
  nextDate: string; // yyyy-mm-dd
}

export type NewRecurringRule = Omit<RecurringRule, "id">;
