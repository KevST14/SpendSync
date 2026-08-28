import { NextResponse } from "next/server";
import { deleteBudget } from "@/lib/budgets";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const deleted = await deleteBudget(id);
  if (!deleted) {
    return NextResponse.json({ error: "Budget not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
