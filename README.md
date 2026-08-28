# SpendSync

A personal finance dashboard — track expenses and income, see spend by
category, and review recent activity. Built with the Next.js App Router.

## Stack

| Concern    | Choice                                          |
| ---------- | ----------------------------------------------- |
| Framework  | Next.js 15 (App Router), React 18               |
| Language   | TypeScript (strict)                             |
| Styling    | Tailwind CSS, CSS-variable tokens, light + dark |
| Charts     | Chart.js (`react-chartjs-2`), code-split        |
| Database   | PostgreSQL via Prisma ORM                       |
| Validation | Zod (API request bodies)                        |
| Formatting | Prettier + `prettier-plugin-tailwindcss`        |

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
    (dashboard)/        route group — async layout: sidebar + topbar + <main>
      page.tsx          overview dashboard (live aggregates)
      expenses/         expenses list + add/delete
      income/           income analytics (read-only)
      budgets/          budget vs. actual per category
      recurring/        scheduled rules that post transactions
      settings/         display name, theme, export / reset
    api/                REST handlers (expenses, budgets, settings, demo/reset)
    components/         Sidebar, Topbar, Chart (dynamic), Button, Theme*, …
  lib/
    prisma.ts           PrismaClient singleton
    expenses.ts | budgets.ts | settings.ts   data-access
    stats.ts            pure aggregation helpers
    validation.ts       Zod schemas
    format.ts           GBP currency formatting
    demo.ts             seed dataset + resetDemoData()
    types.ts            shared API/UI types
prisma/
  schema.prisma         Expense / Budget / Settings / RecurringRule models
  seed.ts               loads the demo dataset
```

## API

| Method | Path                      | Body                                                        | Response                                   |
| ------ | ------------------------- | ----------------------------------------------------------- | ------------------------------------------ |
| GET    | `/api/expenses`           | —                                                           | `Expense[]`                                |
| POST   | `/api/expenses`           | `{ date, amount, category, notes?, type? }`                 | `{ expense }` (201)                        |
| PUT    | `/api/expenses/:id`       | partial of the POST body                                    | `{ expense }`                              |
| DELETE | `/api/expenses/:id`       | —                                                           | 204                                        |
| GET    | `/api/budgets`            | —                                                           | `Budget[]`                                 |
| PUT    | `/api/budgets`            | `{ category, monthlyLimit }`                                | `{ budget }` (upsert by category)          |
| DELETE | `/api/budgets/:id`        | —                                                           | 204                                        |
| GET    | `/api/settings`           | —                                                           | `{ displayName }`                          |
| PUT    | `/api/settings`           | `{ displayName }`                                           | `{ settings }`                             |
| GET    | `/api/recurring`          | —                                                           | `RecurringRule[]`                          |
| POST   | `/api/recurring`          | `{ category, amount, type?, frequency?, nextDate, notes? }` | `{ rule }` (201)                           |
| PUT    | `/api/recurring/:id`      | partial of the POST body                                    | `{ rule }`                                 |
| DELETE | `/api/recurring/:id`      | —                                                           | 204                                        |
| POST   | `/api/recurring/:id/post` | —                                                           | `{ expense, rule }` (posts one occurrence) |
| POST   | `/api/recurring/post-due` | —                                                           | `{ posted }` (posts everything due)        |
| POST   | `/api/demo/reset`         | —                                                           | `{ ok: true }` (reloads demo data)         |

`date` is `yyyy-mm-dd`, `amount` / `monthlyLimit` are positive numbers in
pounds, `type` is `"expense"` (default) or `"income"`. Invalid bodies
return `400` with an `issues` map from Zod.
