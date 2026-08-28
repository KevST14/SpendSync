import { NextResponse } from "next/server";
import { deleteRecurring, updateRecurring } from "@/lib/recurring";
import { updateRecurringSchema } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateRecurringSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const rule = await updateRecurring(id, parsed.data);
  if (!rule) {
    return NextResponse.json({ error: "Rule not found" }, { status: 404 });
  }
  return NextResponse.json({ rule });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const deleted = await deleteRecurring(id);
  if (!deleted) {
    return NextResponse.json({ error: "Rule not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
