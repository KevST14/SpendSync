import { NextResponse } from "next/server";
import { postRecurring } from "@/lib/recurring";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const result = await postRecurring(id);
  if (!result) {
    return NextResponse.json({ error: "Rule not found" }, { status: 404 });
  }
  return NextResponse.json(result, { status: 201 });
}
