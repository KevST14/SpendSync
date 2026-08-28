import { NextResponse } from "next/server";
import { createExpense, listExpenses } from "@/lib/expenses";
import { createExpenseSchema } from "@/lib/validation";

export async function GET() {
  const expenses = await listExpenses();
  return NextResponse.json(expenses);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createExpenseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const expense = await createExpense(parsed.data);
  return NextResponse.json({ expense }, { status: 201 });
}
