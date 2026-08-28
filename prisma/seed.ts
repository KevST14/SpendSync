import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const expenses: Prisma.ExpenseCreateManyInput[] = [
  {
    date: new Date("2026-08-01"),
    amount: 68.4,
    category: "Groceries",
    notes: "Weekly shop",
    type: "EXPENSE",
  },
  {
    date: new Date("2026-08-02"),
    amount: 12.99,
    category: "Entertainment",
    notes: "Streaming",
    type: "EXPENSE",
  },
  {
    date: new Date("2026-08-03"),
    amount: 41.5,
    category: "Transport",
    notes: "Rail season top-up",
    type: "EXPENSE",
  },
  {
    date: new Date("2026-08-05"),
    amount: 2400,
    category: "Salary",
    notes: "Monthly pay",
    type: "INCOME",
  },
  {
    date: new Date("2026-08-06"),
    amount: 95.2,
    category: "Utilities",
    notes: "Electricity & gas",
    type: "EXPENSE",
  },
  {
    date: new Date("2026-08-09"),
    amount: 54,
    category: "Dining",
    notes: "Dinner with friends",
    type: "EXPENSE",
  },
  {
    date: new Date("2026-08-11"),
    amount: 73.15,
    category: "Groceries",
    notes: "Weekly shop",
    type: "EXPENSE",
  },
  {
    date: new Date("2026-08-14"),
    amount: 320,
    category: "Freelance",
    notes: "Logo project",
    type: "INCOME",
  },
  {
    date: new Date("2026-08-15"),
    amount: 29.99,
    category: "Health",
    notes: "Gym membership",
    type: "EXPENSE",
  },
  {
    date: new Date("2026-08-18"),
    amount: 18.75,
    category: "Transport",
    notes: "Taxi",
    type: "EXPENSE",
  },
  {
    date: new Date("2026-08-21"),
    amount: 64.3,
    category: "Groceries",
    notes: "Weekly shop",
    type: "EXPENSE",
  },
  {
    date: new Date("2026-08-23"),
    amount: 140,
    category: "Shopping",
    notes: "Autumn clothes",
    type: "EXPENSE",
  },
  {
    date: new Date("2026-08-25"),
    amount: 9.5,
    category: "Entertainment",
    notes: "Cinema",
    type: "EXPENSE",
  },
  {
    date: new Date("2026-08-27"),
    amount: 47.8,
    category: "Utilities",
    notes: "Broadband",
    type: "EXPENSE",
  },
];

async function main() {
  await prisma.expense.deleteMany();
  await prisma.expense.createMany({ data: expenses });
  console.log(`Seeded ${expenses.length} expenses.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
