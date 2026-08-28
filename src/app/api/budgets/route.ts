import { NextResponse } from "next/server";
import { listBudgets, upsertBudget } from "@/lib/budgets";
import { budgetSchema } from "@/lib/validation";

export async function GET() {
  const budgets = await listBudgets();
  return NextResponse.json(budgets);
}

// PUT on the collection: upsert the budget for a category (category is unique).
export async function PUT(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = budgetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const budget = await upsertBudget(parsed.data);
  return NextResponse.json({ budget });
}
