# Leaderboard Entry Points + Edit Riwayat — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make leaderboard rows clickable to dashboards, and enable editing historical Ramadhan entries via the existing journal form with a `?day=N` query param.

**Architecture:** Reuse the existing `/log/[id]` form page, adding edit mode via `useSearchParams()`. The `PuasaStatus` ("full"/"half"/"none") from `historicalLogs` maps to `PuasaOption` ("Puasa Penuh"/"Setengah Hari"/"Tidak Puasa") for form pre-fill. Navigation links added in leaderboard, dashboard history rows, and history matrix cells.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4, Lucide React icons

---

### Task 1: Add PuasaStatus-to-PuasaOption mapping helper (`lib/mockData.ts`)

**Files:**
- Modify: `lib/mockData.ts`

**Step 1: Add the mapping function**

Add after the `getUserStats` function at the end of the file:

```typescript
const statusToOption: Record<PuasaStatus, PuasaOption> = {
  full: "Puasa Penuh",
  half: "Setengah Hari",
  none: "Tidak Puasa",
};

export function puasaStatusToOption(status: PuasaStatus): PuasaOption {
  return statusToOption[status];
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds, no type errors

**Step 3: Commit**

```bash
git add lib/mockData.ts
git commit -m "feat: add puasaStatusToOption mapping helper"
```

---

### Task 2: Add edit mode to log page (`app/log/[id]/page.tsx`)

**Files:**
- Modify: `app/log/[id]/page.tsx`

**Step 1: Add imports**

Change import line 3 from:
```typescript
import { useRouter } from "next/navigation";
```
to:
```typescript
import { useRouter, useSearchParams } from "next/navigation";
```

Add to the mockData imports:
```typescript
import { users, historicalLogs, puasaStatusToOption } from "@/lib/mockData";
import type { PuasaOption } from "@/lib/mockData";
```

**Step 2: Read `day` param and compute edit state**

Inside `LogPage`, after `const user = users.find(...)` (line 60), add:

```typescript
const searchParams = useSearchParams();
const dayParam = searchParams.get("day");
const editDay = dayParam ? Number(dayParam) : null;

// Look up historical record for edit mode
const editRecord = editDay
  ? historicalLogs.find((l) => l.day === editDay)?.records[id]
  : null;
```

**Step 3: Pre-fill form state from editRecord**

Change the useState defaults (lines 62-64) to use editRecord when present:

```typescript
const [puasa, setPuasa] = useState<PuasaOption>(
  editRecord ? puasaStatusToOption(editRecord.puasa) : "Puasa Penuh"
);
const [ngaji, setNgaji] = useState(editRecord?.ngaji ?? false);
const [olahraga, setOlahraga] = useState(editRecord?.olahraga ?? false);
```

**Step 4: Update handleSimpan to navigate back contextually**

Change the `handleSimpan` function to:

```typescript
function handleSimpan() {
  setSaved(true);
  setTimeout(() => {
    router.push(editDay ? `/dashboard/${id}` : "/");
  }, 1500);
}
```

**Step 5: Update header text for edit mode**

Change the header `<h1>` and subtitle (lines 105-106):

```tsx
<h1 className="text-lg font-bold leading-tight">
  {editDay ? `Edit Hari ${editDay}` : "Jurnal Harian"}
</h1>
<p className="text-emerald-200 text-sm">{user.name} {user.avatar}</p>
```

**Step 6: Update save button text for edit mode**

Change the save button label (line 211) from:
```tsx
<Save className="w-5 h-5" />
Simpan Jurnal
```
to:
```tsx
<Save className="w-5 h-5" />
{editDay ? "Simpan Perubahan" : "Simpan Jurnal"}
```

**Step 7: Update back button to navigate contextually**

Change the back button `onClick` (line 97) from:
```typescript
onClick={() => router.push("/")}
```
to:
```typescript
onClick={() => router.back()}
```

**Step 8: Verify build**

Run: `npm run build`
Expected: Build succeeds, no type errors

**Step 9: Commit**

```bash
git add app/log/[id]/page.tsx
git commit -m "feat: add edit mode to log page via ?day query param"
```

---

### Task 3: Make leaderboard rows clickable (`app/page.tsx`)

**Files:**
- Modify: `app/page.tsx`

**Step 1: Wrap leaderboard row in Link**

The leaderboard section (lines 44-87) renders each user as a `<div>`. Wrap each `<div>` in a `<Link>`:

Change the outer element from:
```tsx
<div
  key={user.id}
  className={`flex items-center gap-4 p-4 rounded-2xl shadow-sm border transition-transform
    ${isFirst
      ? "bg-yellow-50 border-yellow-300 shadow-yellow-100"
      : "bg-white border-green-100"
    }`}
>
```
to:
```tsx
<Link
  key={user.id}
  href={`/dashboard/${user.id}`}
  className={`flex items-center gap-4 p-4 rounded-2xl shadow-sm border transition-all duration-150
    hover:shadow-md hover:scale-[1.01] active:scale-[0.99]
    ${isFirst
      ? "bg-yellow-50 border-yellow-300 shadow-yellow-100 hover:border-yellow-400"
      : "bg-white border-green-100 hover:border-emerald-300"
    }`}
>
```

Change the closing `</div>` to `</Link>`.

Add a `<ChevronRight>` icon after the points section, before the closing `</Link>`:

```tsx
<ChevronRight className={`w-4 h-4 shrink-0 ${isFirst ? "text-yellow-400" : "text-emerald-300"}`} />
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: make leaderboard rows clickable to dashboard"
```

---

### Task 4: Make dashboard history rows clickable (`app/dashboard/[id]/page.tsx`)

**Files:**
- Modify: `app/dashboard/[id]/page.tsx`

**Step 1: Add Pencil import**

Add `Pencil` to the lucide-react import:
```typescript
import { ArrowLeft, Moon, BookOpen, Activity, Utensils, ChevronRight, Pencil } from "lucide-react";
```

**Step 2: Wrap history rows in clickable buttons**

Change the history row outer `<div>` from:
```tsx
<div
  key={log.day}
  className="flex items-center gap-3 bg-white border border-green-100 rounded-xl p-3 shadow-sm"
>
```
to:
```tsx
<button
  key={log.day}
  onClick={() => router.push(`/log/${id}?day=${log.day}`)}
  className="w-full flex items-center gap-3 bg-white border border-green-100 rounded-xl p-3 shadow-sm
             hover:border-emerald-300 hover:bg-emerald-50/50 active:scale-[0.98] transition-all duration-150 text-left"
>
```

Change the closing `</div>` to `</button>`.

Add a pencil icon at the end of each row (after the ngaji/olahraga icons div):
```tsx
<Pencil className="w-3.5 h-3.5 text-gray-300 shrink-0" />
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add app/dashboard/[id]/page.tsx
git commit -m "feat: make dashboard history rows clickable to edit"
```

---

### Task 5: Make history matrix cells clickable (`app/history/page.tsx`)

**Files:**
- Modify: `app/history/page.tsx`

**Step 1: Wrap cell contents in Link**

Change each user cell `<td>` from:
```tsx
<td key={user.id} className="py-3 px-3 text-center">
  <div className="flex items-center justify-center gap-1.5">
    <span className={`w-3 h-3 rounded-full ${puasaDot[rec.puasa]}`} />
    {rec.ngaji && <BookOpen className="w-3.5 h-3.5 text-emerald-500" />}
    {rec.olahraga && <Activity className="w-3.5 h-3.5 text-blue-500" />}
  </div>
</td>
```
to:
```tsx
<td key={user.id} className="py-3 px-3 text-center">
  <Link
    href={`/log/${user.id}?day=${log.day}`}
    className="flex items-center justify-center gap-1.5 rounded-lg p-1
               hover:bg-emerald-50 transition-colors"
  >
    <span className={`w-3 h-3 rounded-full ${puasaDot[rec.puasa]}`} />
    {rec.ngaji && <BookOpen className="w-3.5 h-3.5 text-emerald-500" />}
    {rec.olahraga && <Activity className="w-3.5 h-3.5 text-blue-500" />}
  </Link>
</td>
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add app/history/page.tsx
git commit -m "feat: make history matrix cells clickable to edit"
```

---

### Task 6: End-to-end verification

**Step 1: Run production build**

Run: `npm run build`
Expected: All routes compile, no type errors

**Step 2: Browser verification**

Start dev server: `npm run dev`

Verify these flows:
1. `/` — leaderboard rows are clickable, navigate to `/dashboard/[id]`
2. `/dashboard/ayah` — history rows show pencil icon, clicking Hari 5 navigates to `/log/ayah?day=5`
3. `/log/ayah?day=5` — header says "Edit Hari 5", form pre-filled with Ayah's Day 5 data (Puasa Penuh, Ngaji checked, Olahraga unchecked), save button says "Simpan Perubahan"
4. `/history` — clicking any cell navigates to `/log/[userId]?day=N`
5. `/log/ayah` (no ?day) — still works as "Jurnal Harian" new entry mode

**Step 3: Final commit (if any fixes needed)**
