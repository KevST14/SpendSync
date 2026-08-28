import { PrismaClient } from "@prisma/client";
import { demoBudgets, demoExpenses, demoRecurring, resetDemoData } from "../src/lib/demo";

const prisma = new PrismaClient();

async function main() {
  await resetDemoData(prisma);
  console.log(
    `Seeded ${demoExpenses.length} expenses, ${demoBudgets.length} budgets, ${demoRecurring.length} recurring rules.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
