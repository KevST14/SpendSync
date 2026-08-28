import { NextResponse } from "next/server";
import { createRecurring, listRecurring } from "@/lib/recurring";
import { recurringSchema } from "@/lib/validation";

export async function GET() {
  return NextResponse.json(await listRecurring());
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = recurringSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const rule = await createRecurring(parsed.data);
  return NextResponse.json({ rule }, { status: 201 });
}
