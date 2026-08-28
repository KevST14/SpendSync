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
