import { NextResponse } from "next/server";
import { createGoal, listGoals } from "@/lib/goals";
import { goalSchema } from "@/lib/validation";

export async function GET() {
  return NextResponse.json(await listGoals());
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = goalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const goal = await createGoal(parsed.data);
  return NextResponse.json({ goal }, { status: 201 });
}
