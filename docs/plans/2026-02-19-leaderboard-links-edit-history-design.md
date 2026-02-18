# Design: Leaderboard Entry Points + Edit Riwayat

**Date:** 2026-02-19
**Status:** Approved

## Summary

Add clickable leaderboard rows linking to personal dashboards, and allow editing historical Ramadhan entries by reusing the existing journal form with a `?day=N` query param.

## Changes

### 1. Leaderboard rows link to dashboard (`app/page.tsx`)

Wrap each leaderboard `<div>` in `<Link href={/dashboard/${user.id}}>`. Add ChevronRight icon and hover styles.

### 2. Edit mode on log page (`app/log/[id]/page.tsx`)

Read optional `?day=N` via `useSearchParams()`:
- No param: current "new entry" behavior
- With param: edit mode — pre-fill form from `historicalLogs[day-1].records[userId]`, show "Edit Hari N" header, "Simpan Perubahan" button. On save, update in-memory data and redirect back.

### 3. Clickable history rows on dashboard (`app/dashboard/[id]/page.tsx`)

Each "Riwayat 3 Hari Terakhir" row links to `/log/[id]?day=N`. Add pencil icon and hover state.

### 4. Clickable cells on history matrix (`app/history/page.tsx`)

Each matrix cell links to `/log/[userId]?day=N` via `<Link>`. Add hover state.

## Files

| File | Action |
|------|--------|
| `app/page.tsx` | Modify — wrap leaderboard rows in Link |
| `app/log/[id]/page.tsx` | Modify — add ?day edit mode with pre-fill |
| `app/dashboard/[id]/page.tsx` | Modify — make history rows clickable |
| `app/history/page.tsx` | Modify — make cells clickable |

No new files. No data model changes.
