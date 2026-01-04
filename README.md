# Flyo 🚀

> A mini, modern Next.js + Prisma repo for managing and previewing code snippets — optimized for local development with Bun.

This repository contains a modern Next.js app using the App Router, Prisma for the database layer, and a small set of UI components. It's structured to be easy to explore and extend.

**Tech stack**

- Next.js (App Router)
- TypeScript
- Prisma (database client / schema in `prisma/schema.prisma`)
- Bun as package manager / runner

**Features**

- Create, edit, and preview code snippets with ease ✨
- Live HTML preview for snippet rendering (preview route) 🖥️
- Simple auth & protected routes (password protection) 🔒
- Prisma-backed storage with migrations and generated client 🗄️
- Reusable, accessible UI components for fast iteration 🎨
- Fast local developer experience using Bun (install & run) ⚡

**Project structure (high level)**

- `src/app` — Next.js pages and routes (App Router). Key routes: `login`, `dashboard`, `edit`, `preview`.
- `src/components` — React components and UI primitives.
- `src/actions` — server/client actions (e.g. `src/actions/snippets.ts`).
- `src/lib` — helpers (Prisma client, utils).
- `prisma` — Prisma schema and related config.

## Getting started

Prerequisites:

- Bun installed: https://bun.sh
- A supported database and a `DATABASE_URL` environment variable (Postgres/SQLite/etc.)

Local development (typical):

1. Install dependencies

```bash
bun install
```

2. Prepare environment

- Create a `.env` file with at least `DATABASE_URL` set. Example for SQLite:

```env
DATABASE_URL="file:./dev.db"
```

3. Run Prisma (generate client / apply migrations as needed)

```bash
# generate Prisma client
bun run prisma generate

# if you have migrations to apply (development)
bun run prisma migrate dev --name init
```

4. Start the development server

```bash
bun run dev
```

Build & production

```bash
# build
bun run build

# start (depending on how the project is configured)
bun run start
```

Key files to inspect

- `src/actions/snippets.ts` — business logic for snippet actions.
- `src/components` — UI building blocks used across the app.
- `src/app` — top-level route layout and page entries.
- `prisma/schema.prisma` — database schema used by Prisma.

## Notes

- This README is a concise starting point — expand sections like testing, CI, environment variables, and deployment notes as the project grows.
