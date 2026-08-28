# SpendSync

A personal finance dashboard — track expenses and income, see spend by
category, and review recent activity. Built with the Next.js App Router.

## Stack

| Concern    | Choice                                   |
| ---------- | ---------------------------------------- |
| Framework  | Next.js 15 (App Router), React 18        |
| Language   | TypeScript (strict)                      |
| Styling    | Tailwind CSS, dark theme                 |
| Charts     | Chart.js (`react-chartjs-2`), code-split |
| Database   | PostgreSQL via Prisma ORM                |
| Validation | Zod (API request bodies)                 |
| Formatting | Prettier + `prettier-plugin-tailwindcss` |

## Getting started

### 1. Install

```bash
npm install
```

### 2. Database

Any PostgreSQL database works. For the deployed demo this uses a free
[Neon](https://neon.tech) project.

Copy the env template and set your connection string:

```bash
cp .env.example .env
# edit .env and set DATABASE_URL
```

Then create the schema and seed sample data:

```bash
npm run db:migrate      # apply migrations
npm run db:seed         # insert sample expenses
```

### 3. Run

```bash
npm run dev
```

Open http://localhost:3000.

## Scripts

| Script               | Purpose              |
| -------------------- | -------------------- |
| `npm run dev`        | Start the dev server |
| `npm run build`      | Production build     |
| `npm run typecheck`  | `tsc --noEmit`       |
| `npm run lint`       | ESLint (`next lint`) |
| `npm run format`     | Prettier write       |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:seed`    | Seed the database    |
| `npm run db:studio`  | Open Prisma Studio   |

## Project layout

```
src/
  app/
    (dashboard)/        route group — shared sidebar + <main> shell
      page.tsx          overview dashboard
      expenses/         expenses list + add/delete
      income|budgets|settings/   placeholder pages
    api/expenses/       REST handlers (GET/POST, PUT/DELETE by id)
    components/         Sidebar, Chart (dynamic), PlaceholderPage
  lib/
    prisma.ts           PrismaClient singleton
    expenses.ts         data-access functions
    validation.ts       Zod schemas
    format.ts           GBP currency formatting
    types.ts            shared API/UI types
prisma/
  schema.prisma         Expense model
  seed.ts               sample data
```

## API

| Method | Path                | Body                                        | Response            |
| ------ | ------------------- | ------------------------------------------- | ------------------- |
| GET    | `/api/expenses`     | —                                           | `Expense[]`         |
| POST   | `/api/expenses`     | `{ date, amount, category, notes?, type? }` | `{ expense }` (201) |
| PUT    | `/api/expenses/:id` | partial of the POST body                    | `{ expense }`       |
| DELETE | `/api/expenses/:id` | —                                           | 204                 |

`date` is `yyyy-mm-dd`, `amount` is a positive number in pounds, `type` is
`"expense"` (default) or `"income"`. Invalid bodies return `400` with a
`issues` map from Zod.
