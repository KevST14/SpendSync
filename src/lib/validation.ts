import { z } from "zod";

/** Payload accepted when creating an expense. */
export const createExpenseSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be yyyy-mm-dd"),
  amount: z.coerce.number().positive("amount must be greater than 0"),
  category: z.string().trim().min(1, "category is required").max(60),
  notes: z.string().trim().max(280).default(""),
  type: z.enum(["expense", "income"]).default("expense"),
});

/** Payload accepted when updating an expense — every field optional. */
export const updateExpenseSchema = createExpenseSchema.partial();

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

/** Payload accepted when setting a budget (upsert by category). */
export const budgetSchema = z.object({
  category: z.string().trim().min(1, "category is required").max(60),
  monthlyLimit: z.coerce.number().positive("monthlyLimit must be greater than 0"),
});

export type BudgetInput = z.infer<typeof budgetSchema>;

/** Payload accepted when updating application settings. */
export const settingsSchema = z.object({
  displayName: z.string().trim().min(1, "displayName is required").max(60),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

/** Payload accepted when creating a recurring rule. */
export const recurringSchema = z.object({
  category: z.string().trim().min(1, "category is required").max(60),
  amount: z.coerce.number().positive("amount must be greater than 0"),
  notes: z.string().trim().max(280).default(""),
  type: z.enum(["expense", "income"]).default("expense"),
  frequency: z.enum(["weekly", "monthly"]).default("monthly"),
  nextDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "nextDate must be yyyy-mm-dd"),
});

export const updateRecurringSchema = recurringSchema.partial();

export type RecurringInput = z.infer<typeof recurringSchema>;
export type UpdateRecurringInput = z.infer<typeof updateRecurringSchema>;

/** Payload accepted when creating a savings goal. */
export const goalSchema = z.object({
  name: z.string().trim().min(1, "name is required").max(80),
  target: z.coerce.number().positive("target must be greater than 0"),
  targetDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "targetDate must be yyyy-mm-dd")
    .nullish()
    .transform((v) => v ?? null),
});

export const updateGoalSchema = goalSchema.partial();

export const contributeSchema = z.object({
  amount: z.coerce.number().positive("amount must be greater than 0"),
});

export type GoalInput = z.infer<typeof goalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
