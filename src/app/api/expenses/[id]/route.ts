import { NextResponse } from "next/server";
import { deleteExpense, updateExpense } from "@/lib/expenses";
import { updateExpenseSchema } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateExpenseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const expense = await updateExpense(id, parsed.data);
  if (!expense) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }
  return NextResponse.json({ expense });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const deleted = await deleteExpense(id);
  if (!deleted) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
