# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Run production build
npm run lint     # ESLint check
```

## Architecture

**Next.js 15 App Router** with TypeScript and Tailwind CSS v4.

- `app/` — Next.js App Router pages and layouts
- `app/log/[id]/page.tsx` — Dynamic route for per-user daily journal entry; uses `"use client"` with `React.use(params)` to unwrap the async `params` Promise (Next.js 15 requirement)
- `lib/mockData.ts` — Single source of truth for all data: user list (`users`), sorted leaderboard (`leaderboard`), and shared types (`User`, `DailyLog`, `PuasaOption`). No database — Phase 1 is entirely mock data.

## Key Conventions

- **Path alias:** `@/` maps to the project root (e.g. `import { users } from "@/lib/mockData"`)
- **Client components:** Any component using `useState`, `useRouter`, or `React.use()` must have `"use client"` at the top
- **Dynamic route params (Next.js 15):** `params` is a Promise — always unwrap with `const { id } = use(params)`, not `params.id` directly
- **User IDs** are lowercase name strings: `"ayah"`, `"ibu"`, `"hafizh"`, `"hasna"` — not numbers
- **Tailwind v4** is used via `@tailwindcss/postcss` plugin (not the classic v3 config file)
- `suppressHydrationWarning` is set on `<body>` in `layout.tsx` to suppress false mismatches from browser extensions
