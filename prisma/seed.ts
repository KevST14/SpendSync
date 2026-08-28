import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type Row = Omit<Prisma.ExpenseCreateManyInput, "date"> & { date: string };

// Four months of activity so the dashboard trend charts have shape.
const rows: Row[] = [
  // May 2026
  {
    date: "2026-05-05",
    amount: 2400,
    category: "Salary",
    notes: "Monthly pay",
    type: "INCOME",
  },
  {
    date: "2026-05-07",
    amount: 92.4,
    category: "Utilities",
    notes: "Electricity & gas",
    type: "EXPENSE",
  },
  {
    date: "2026-05-09",
    amount: 61.2,
    category: "Groceries",
    notes: "Weekly shop",
    type: "EXPENSE",
  },
  {
    date: "2026-05-16",
    amount: 45,
    category: "Dining",
    notes: "Lunch out",
    type: "EXPENSE",
  },
  {
    date: "2026-05-19",
    amount: 33.5,
    category: "Transport",
    notes: "Rail top-up",
    type: "EXPENSE",
  },
  {
    date: "2026-05-23",
    amount: 70.15,
    category: "Groceries",
    notes: "Weekly shop",
    type: "EXPENSE",
  },
  {
    date: "2026-05-28",
    amount: 250,
    category: "Freelance",
    notes: "Poster design",
    type: "INCOME",
  },

  // June 2026
  {
    date: "2026-06-05",
    amount: 2400,
    category: "Salary",
    notes: "Monthly pay",
    type: "INCOME",
  },
  {
    date: "2026-06-06",
    amount: 88.9,
    category: "Utilities",
    notes: "Electricity & gas",
    type: "EXPENSE",
  },
  {
    date: "2026-06-10",
    amount: 64.3,
    category: "Groceries",
    notes: "Weekly shop",
    type: "EXPENSE",
  },
  {
    date: "2026-06-14",
    amount: 120,
    category: "Shopping",
    notes: "Trainers",
    type: "EXPENSE",
  },
  {
    date: "2026-06-18",
    amount: 29.99,
    category: "Health",
    notes: "Gym membership",
    type: "EXPENSE",
  },
  {
    date: "2026-06-25",
    amount: 52.4,
    category: "Dining",
    notes: "Dinner with friends",
    type: "EXPENSE",
  },

  // July 2026
  {
    date: "2026-07-05",
    amount: 2400,
    category: "Salary",
    notes: "Monthly pay",
    type: "INCOME",
  },
  {
    date: "2026-07-08",
    amount: 95.6,
    category: "Utilities",
    notes: "Electricity & gas",
    type: "EXPENSE",
  },
  {
    date: "2026-07-11",
    amount: 58.75,
    category: "Groceries",
    notes: "Weekly shop",
    type: "EXPENSE",
  },
  {
    date: "2026-07-17",
    amount: 420,
    category: "Freelance",
    notes: "Website build",
    type: "INCOME",
  },
  {
    date: "2026-07-19",
    amount: 41.5,
    category: "Transport",
    notes: "Rail top-up",
    type: "EXPENSE",
  },
  {
    date: "2026-07-22",
    amount: 18.99,
    category: "Entertainment",
    notes: "Concert ticket",
    type: "EXPENSE",
  },
  {
    date: "2026-07-29",
    amount: 67.4,
    category: "Groceries",
    notes: "Weekly shop",
    type: "EXPENSE",
  },

  // August 2026
  {
    date: "2026-08-05",
    amount: 2400,
    category: "Salary",
    notes: "Monthly pay",
    type: "INCOME",
  },
  {
    date: "2026-08-06",
    amount: 95.2,
    category: "Utilities",
    notes: "Electricity & gas",
    type: "EXPENSE",
  },
  {
    date: "2026-08-09",
    amount: 54,
    category: "Dining",
    notes: "Dinner with friends",
    type: "EXPENSE",
  },
  {
    date: "2026-08-11",
    amount: 73.15,
    category: "Groceries",
    notes: "Weekly shop",
    type: "EXPENSE",
  },
  {
    date: "2026-08-15",
    amount: 29.99,
    category: "Health",
    notes: "Gym membership",
    type: "EXPENSE",
  },
  {
    date: "2026-08-18",
    amount: 18.75,
    category: "Transport",
    notes: "Taxi",
    type: "EXPENSE",
  },
  {
    date: "2026-08-21",
    amount: 64.3,
    category: "Groceries",
    notes: "Weekly shop",
    type: "EXPENSE",
  },
  {
    date: "2026-08-23",
    amount: 140,
    category: "Shopping",
    notes: "Autumn clothes",
    type: "EXPENSE",
  },
  {
    date: "2026-08-25",
    amount: 9.5,
    category: "Entertainment",
    notes: "Cinema",
    type: "EXPENSE",
  },
  {
    date: "2026-08-27",
    amount: 47.8,
    category: "Utilities",
    notes: "Broadband",
    type: "EXPENSE",
  },
];

async function main() {
  await prisma.expense.deleteMany();
  await prisma.expense.createMany({
    data: rows.map((row) => ({ ...row, date: new Date(row.date) })),
  });
  console.log(`Seeded ${rows.length} expenses across 4 months.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
