import { PrismaClient } from "@prisma/client";
import { demoBudgets, demoExpenses, resetDemoData } from "../src/lib/demo";

const prisma = new PrismaClient();

async function main() {
  await resetDemoData(prisma);
  console.log(
    `Seeded ${demoExpenses.length} expenses and ${demoBudgets.length} budgets.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
