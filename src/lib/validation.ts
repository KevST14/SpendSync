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
