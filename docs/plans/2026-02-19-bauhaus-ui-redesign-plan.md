# Bauhaus UI Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite all 4 pages of the Ramadhan Activity Tracker to a bold Bauhaus visual style, matching the HTML/PNG mockups in `draft_ui/`.

**Architecture:** Page-by-page rewrite on a feature branch. Shared Bauhaus design tokens go in `globals.css` (Tailwind v4 `@theme`). Outfit + Inter fonts via `next/font/google`. Material Symbols via CDN. A new `BottomNav` component is shared by Homepage and Dashboard.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4, `next/font/google`, Material Symbols Outlined (CDN)

**Reference mockups:** `draft_ui/home_&_leaderboard/code.html`, `draft_ui/daily_log_form/code.html`, `draft_ui/personal_dashboard/code.html`, `draft_ui/history_matrix_calendar/code.html`

---

## Task 0: Create Feature Branch

**Step 1: Create and switch to feature branch**

```bash
git checkout -b feat/bauhaus-ui-redesign
```

**Step 2: Verify branch**

```bash
git branch --show-current
```
Expected: `feat/bauhaus-ui-redesign`

---

## Task 1: Infrastructure — Fonts, Icons, Global Styles

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

**Step 1: Update `app/globals.css`**

Replace entire contents with Bauhaus design tokens using Tailwind v4's `@theme` directive plus global styles:

```css
@import "tailwindcss";

@theme {
  --color-bauhaus-red: #D03025;
  --color-bauhaus-blue: #1C5BB8;
  --color-bauhaus-yellow: #F7C924;
  --color-bauhaus-black: #121212;
  --color-bauhaus-white: #F0F0F0;
  --color-bauhaus-green: #2E7D32;

  --shadow-hard: 8px 8px 0px 0px #000000;
  --shadow-hard-sm: 4px 4px 0px 0px #000000;
  --shadow-hard-hover: 12px 12px 0px 0px #000000;
  --shadow-hard-lg: 8px 8px 0px 0px rgba(18,18,18,1);
}

/* Dot-grid background pattern */
body {
  background-color: #F0F0F0;
  background-image: radial-gradient(#121212 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Material Symbols config */
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 700,
    'GRAD' 0,
    'opsz' 48;
}

/* Hide scrollbar utility */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Triangle shape for history matrix (partial status) */
.triangle {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 20px solid #F7C924;
}
```

**Step 2: Update `app/layout.tsx`**

Replace with Outfit + Inter fonts via `next/font/google` and Material Symbols CDN link:

```tsx
import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "700", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Jurnal Ramadhan Keluarga",
  description: "Tracker aktivitas Ramadhan untuk seluruh keluarga",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${outfit.variable} ${inter.variable} font-[family-name:var(--font-inter)] min-h-screen antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
```

**Step 3: Verify build compiles**

```bash
npm run build 2>&1 | tail -5
```
Expected: Build succeeds (or at least no layout/CSS errors — page errors are OK since we haven't rewritten them yet).

**Step 4: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: add Bauhaus design infrastructure — fonts, icons, global styles"
```

---

## Task 2: BottomNav Shared Component

**Files:**
- Create: `components/BottomNav.tsx`

**Step 1: Create the component**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  icon: string;
  label: string;
  activeColor: string;
  hoverColor: string;
}

const navItems: NavItem[] = [
  { href: "/", icon: "home", label: "Home", activeColor: "bg-bauhaus-red text-white", hoverColor: "hover:bg-bauhaus-red hover:text-white" },
  { href: "#", icon: "book_2", label: "Jurnal", activeColor: "bg-bauhaus-blue text-white", hoverColor: "hover:bg-bauhaus-blue hover:text-white" },
  { href: "#", icon: "leaderboard", label: "Klasemen", activeColor: "bg-bauhaus-yellow text-black", hoverColor: "hover:bg-bauhaus-yellow hover:text-black" },
  { href: "#", icon: "person", label: "Profil", activeColor: "bg-black text-white", hoverColor: "hover:bg-black hover:text-white" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-t-4 border-black p-0 grid grid-cols-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.icon}
            href={item.href}
            className={`flex flex-col items-center justify-center py-4 border-r-2 border-black last:border-r-0 transition-colors h-full
              ${isActive ? item.activeColor : `text-black ${item.hoverColor}`}`}
            aria-label={item.label}
          >
            <span className="material-symbols-outlined text-3xl">{item.icon}</span>
          </Link>
        );
      })}
    </nav>
  );
}
```

**Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

**Step 3: Commit**

```bash
git add components/BottomNav.tsx
git commit -m "feat: add BottomNav shared component"
```

---

## Task 3: Homepage Rewrite (`app/page.tsx`)

**Files:**
- Modify: `app/page.tsx`

**Step 1: Rewrite homepage**

Reference mockup: `draft_ui/home_&_leaderboard/code.html`

Key elements:
- Replace all lucide-react imports with Material Symbols spans
- Header: "RAMADAN JURNAL" with red circle decoration, "KELUARGA" badge, dynamic day count
- Klasemen: #1 = yellow card with star, "PEMIMPIN" tag, large points; #2-4 = white cards with colored rank numbers
- Isi Jurnal: 2x2 grid of colored cards (red/blue/yellow/white) with emoji avatars and names
- Footer: "RIWAYAT RAMADHAN" blue button linking to `/history`
- All cards have border-4 border-black, shadow-hard, hover effects
- Leaderboard rows link to `/dashboard/[id]`, journal cards link to `/log/[id]`

```tsx
import Link from "next/link";
import { leaderboard, users, historicalLogs } from "@/lib/mockData";

const rankBadgeColors = [
  "", // #1 uses star instead
  "bg-bauhaus-blue",
  "bg-bauhaus-red",
  "bg-bauhaus-black",
];

const journalCardColors: Record<string, string> = {
  ayah: "bg-bauhaus-red",
  ibu: "bg-bauhaus-blue",
  hafizh: "bg-bauhaus-yellow",
  hasna: "bg-white",
};

export default function HomePage() {
  const currentDay = historicalLogs.length;

  return (
    <div className="flex items-center justify-center min-h-screen p-4 font-[family-name:var(--font-inter)] text-bauhaus-black">
      <div className="w-full max-w-[480px] bg-white min-h-[850px] border-4 border-black shadow-hard flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="p-6 border-b-4 border-black bg-bauhaus-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-bauhaus-red rounded-full border-4 border-black" />
          <div className="relative z-10">
            <h1 className="text-5xl font-[family-name:var(--font-outfit)] font-black uppercase leading-[0.85] tracking-tight mb-2">
              Ramadan<br />Jurnal
            </h1>
            <div className="flex items-center gap-2">
              <span className="bg-black text-white px-2 py-0.5 text-sm font-bold uppercase tracking-wider">
                Keluarga
              </span>
              <span className="text-sm font-bold">Hari ke-{currentDay}</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Klasemen */}
          <section>
            <div className="flex items-end justify-between mb-4 border-b-4 border-black pb-2">
              <h2 className="text-2xl font-[family-name:var(--font-outfit)] font-black uppercase">Klasemen</h2>
              <span className="material-symbols-outlined text-3xl">leaderboard</span>
            </div>
            <div className="flex flex-col gap-4">
              {leaderboard.map((user, index) => {
                if (index === 0) {
                  return (
                    <Link
                      key={user.id}
                      href={`/dashboard/${user.id}`}
                      className="relative bg-bauhaus-yellow border-4 border-black p-4 shadow-hard flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-hard-hover"
                    >
                      <div className="absolute -top-3 -right-3 bg-white border-4 border-black w-10 h-10 flex items-center justify-center shadow-hard-sm z-10">
                        <span className="material-symbols-outlined text-bauhaus-black text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                      <div className="w-16 h-16 border-4 border-black overflow-hidden bg-white shrink-0 flex items-center justify-center">
                        <span className="text-4xl">{user.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-[family-name:var(--font-outfit)] font-black uppercase">{user.name}</h3>
                        <div className="text-xs font-bold bg-black text-white inline-block px-2 py-0.5">PEMIMPIN</div>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-black block">{user.points.toLocaleString("id-ID")}</span>
                        <span className="text-xs font-bold uppercase tracking-widest">Poin</span>
                      </div>
                    </Link>
                  );
                }
                return (
                  <Link
                    key={user.id}
                    href={`/dashboard/${user.id}`}
                    className="relative bg-white border-4 border-black p-3 shadow-hard-sm flex items-center gap-3 hover:-translate-y-0.5 transition-transform"
                  >
                    <div className={`flex items-center justify-center w-8 h-8 ${rankBadgeColors[index]} text-white font-black border-2 border-black text-lg`}>
                      {index + 1}
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-black overflow-hidden shrink-0 flex items-center justify-center bg-white">
                      <span className="text-2xl">{user.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-bold uppercase truncate">{user.name}</p>
                    </div>
                    <div className="font-black text-lg">{user.points.toLocaleString("id-ID")}</div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Isi Jurnal */}
          <section>
            <div className="flex items-end justify-between mb-4 border-b-4 border-black pb-2">
              <h2 className="text-2xl font-[family-name:var(--font-outfit)] font-black uppercase">Isi Jurnal</h2>
              <span className="material-symbols-outlined text-3xl">edit_square</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {users.map((user) => {
                const bg = journalCardColors[user.id] ?? "bg-white";
                const textColor = user.id === "hafizh" ? "text-black bg-white border-2 border-black" : "text-white bg-black";
                return (
                  <Link
                    key={user.id}
                    href={`/log/${user.id}`}
                    className={`group relative aspect-square ${bg} border-4 border-black shadow-hard hover:shadow-hard-hover hover:-translate-y-1 transition-all flex flex-col items-center justify-center p-2 overflow-hidden`}
                  >
                    <div className="w-16 h-16 border-4 border-black bg-white mb-2 overflow-hidden flex items-center justify-center">
                      <span className="text-4xl">{user.avatar}</span>
                    </div>
                    <span className={`font-black uppercase text-lg px-2 py-0.5 ${textColor}`}>
                      {user.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </main>

        {/* Footer Button */}
        <div className="p-6 border-t-4 border-black bg-white relative z-20">
          <Link
            href="/history"
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-bauhaus-blue border-4 border-black shadow-hard active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
          >
            <span className="material-symbols-outlined text-white text-3xl">history</span>
            <span className="text-white text-xl font-[family-name:var(--font-outfit)] font-black uppercase tracking-wide">
              Riwayat Ramadhan
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify dev server renders**

```bash
npm run dev &
sleep 3
curl -s http://localhost:3000 | head -20
```
Check: No build errors. Page renders HTML.

**Step 3: Verify build**

```bash
npm run build 2>&1 | tail -10
```

**Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: rewrite homepage with Bauhaus design"
```

---

## Task 4: Daily Log Form Rewrite (`app/log/[id]/page.tsx`)

**Files:**
- Modify: `app/log/[id]/page.tsx`

**Step 1: Rewrite daily log form**

Reference mockup: `draft_ui/daily_log_form/code.html`

Key elements:
- Header: Red diagonal accent (skewed div), square back button, "RAMADHAN DAY X" yellow badge, large "LOG" title
- Day info bar: Day name (uppercase) + date, black circle
- Status Puasa: 3 square aspect-ratio cards as radio buttons. TIDAK (no selection = white), SETENGAH (yellow when selected), PENUH (blue when selected with white text)
- Rutinitas: Custom Bauhaus toggles for Ngaji and Olahraga with thick borders
- Simpan: Yellow full-width button
- Keep existing state logic (puasa, ngaji, olahraga, saved, editDay), but restyle entirely
- Keep `"use client"` and `React.use(params)` pattern

```tsx
"use client";

import { use, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { users, historicalLogs, puasaStatusToOption } from "@/lib/mockData";
import type { PuasaOption } from "@/lib/mockData";

const PUASA_OPTIONS: { value: PuasaOption; label: string; selectedBg: string; selectedText: string }[] = [
  { value: "Tidak Puasa", label: "Tidak", selectedBg: "bg-bauhaus-red", selectedText: "text-white" },
  { value: "Setengah Hari", label: "Setengah", selectedBg: "bg-bauhaus-yellow", selectedText: "text-black" },
  { value: "Puasa Penuh", label: "Penuh", selectedBg: "bg-bauhaus-blue", selectedText: "text-white" },
];

function getDayName(dateStr: string): string {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const d = new Date(dateStr);
  return days[d.getDay()];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function LogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const user = users.find((u) => u.id === id);

  const searchParams = useSearchParams();
  const dayParam = searchParams.get("day");
  const editDay = dayParam ? Number(dayParam) : null;

  const editLog = editDay ? historicalLogs.find((l) => l.day === editDay) : null;
  const editRecord = editLog?.records[id] ?? null;

  const currentDay = editDay ?? historicalLogs.length + 1;
  const currentDate = editLog?.date ?? new Date().toISOString().split("T")[0];

  const [puasa, setPuasa] = useState<PuasaOption>(
    editRecord ? puasaStatusToOption(editRecord.puasa) : "Puasa Penuh"
  );
  const [ngaji, setNgaji] = useState(editRecord?.ngaji ?? false);
  const [olahraga, setOlahraga] = useState(editRecord?.olahraga ?? false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (editRecord) {
      setPuasa(puasaStatusToOption(editRecord.puasa));
      setNgaji(editRecord.ngaji);
      setOlahraga(editRecord.olahraga);
    } else {
      setPuasa("Puasa Penuh");
      setNgaji(false);
      setOlahraga(false);
    }
    setSaved(false);
  }, [editDay]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 border-4 border-black bg-white shadow-hard">
          <p className="text-lg font-bold uppercase">Anggota keluarga tidak ditemukan.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-bauhaus-blue text-white font-bold px-4 py-2 border-2 border-black"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  function handleSimpan() {
    setSaved(true);
    setTimeout(() => {
      router.push(editDay ? `/dashboard/${id}` : "/");
    }, 1500);
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-0 sm:p-4 font-[family-name:var(--font-inter)] text-bauhaus-black">
      <main className="w-full max-w-md bg-white border-4 border-black shadow-hard relative z-10 min-h-screen sm:min-h-0 sm:h-[850px] flex flex-col">
        {/* Header */}
        <header className="bg-white border-b-4 border-black px-6 py-6 flex flex-col justify-end min-h-[140px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-full bg-bauhaus-red skew-x-12 translate-x-10 z-0 border-l-4 border-black" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => router.back()}
                aria-label="Kembali"
                className="w-10 h-10 flex items-center justify-center border-2 border-black bg-white hover:bg-black hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined font-bold">arrow_back</span>
              </button>
              <span className="font-mono text-xs uppercase tracking-widest border border-black px-2 py-1 bg-bauhaus-yellow">
                Ramadhan Day {currentDay}
              </span>
            </div>
            <h1 className="text-7xl font-[family-name:var(--font-outfit)] font-black leading-none tracking-tighter mt-2">
              LOG
            </h1>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Day Info Bar */}
          <div className="px-6 py-6 border-b-4 border-black bg-white flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-tight">{getDayName(currentDate)}</h2>
              <p className="font-mono text-sm text-gray-600">{formatDate(currentDate)}</p>
            </div>
            <div className="w-12 h-12 bg-black rounded-full" />
          </div>

          {/* Status Puasa */}
          <div className="px-6 py-8">
            <h3 className="font-[family-name:var(--font-outfit)] font-black text-xl mb-6 uppercase border-l-8 border-bauhaus-blue pl-3 leading-none">
              Status Puasa
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {PUASA_OPTIONS.map((option) => {
                const isSelected = puasa === option.value;
                return (
                  <label key={option.value} className="cursor-pointer group relative">
                    <input
                      type="radio"
                      name="fasting_status"
                      className="peer sr-only"
                      checked={isSelected}
                      onChange={() => setPuasa(option.value)}
                    />
                    <div className={`aspect-square border-4 border-black flex flex-col items-center justify-center gap-2 transition-all
                      ${isSelected ? `${option.selectedBg} ${option.selectedText} shadow-hard-sm` : "bg-white group-hover:translate-x-1 group-hover:translate-y-1"}`}
                    >
                      <div className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center bg-white">
                        {isSelected && <div className="w-3 h-3 rounded-full bg-current" />}
                      </div>
                      <span className="font-bold text-sm uppercase">{option.label}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="h-4 border-y-4 border-black" />

          {/* Rutinitas */}
          <div className="px-6 py-8 space-y-8 bg-white">
            <h3 className="font-[family-name:var(--font-outfit)] font-black text-xl mb-6 uppercase border-l-8 border-bauhaus-red pl-3 leading-none">
              Rutinitas
            </h3>

            {/* Ngaji Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-lg uppercase">Ngaji</h4>
                <p className="text-xs font-mono bg-black text-white px-1 inline-block mt-1">READING</p>
              </div>
              <button
                type="button"
                onClick={() => setNgaji(!ngaji)}
                className={`relative w-24 h-12 border-4 border-black rounded-full overflow-hidden transition-colors ${ngaji ? "bg-bauhaus-yellow" : "bg-gray-200"}`}
                aria-label={`Ngaji: ${ngaji ? "aktif" : "nonaktif"}`}
              >
                <div className={`absolute top-0.5 w-10 h-10 bg-white border-4 border-black rounded-full transition-all flex items-center justify-center shadow-sm ${ngaji ? "left-12" : "left-0.5"}`}>
                  <div className="w-2 h-2 bg-black rounded-full" />
                </div>
              </button>
            </div>

            {/* Olahraga Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-lg uppercase">Olahraga</h4>
                <p className="text-xs font-mono bg-black text-white px-1 inline-block mt-1">SPORT</p>
              </div>
              <button
                type="button"
                onClick={() => setOlahraga(!olahraga)}
                className={`relative w-24 h-12 border-4 border-black rounded-full overflow-hidden transition-colors ${olahraga ? "bg-bauhaus-blue" : "bg-gray-200"}`}
                aria-label={`Olahraga: ${olahraga ? "aktif" : "nonaktif"}`}
              >
                <div className={`absolute top-0.5 w-10 h-10 bg-white border-4 border-black rounded-full transition-all flex items-center justify-center shadow-sm ${olahraga ? "left-12" : "left-0.5"}`}>
                  <div className="w-2 h-2 bg-black rounded-full" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Save Button (sticky bottom) */}
        <div className="p-4 bg-white border-t-4 border-black z-20">
          {saved ? (
            <div className="w-full py-4 bg-bauhaus-green border-4 border-black text-white font-[family-name:var(--font-outfit)] font-black text-xl uppercase tracking-widest flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
              Tersimpan!
            </div>
          ) : (
            <button
              onClick={handleSimpan}
              className="w-full py-4 bg-bauhaus-yellow border-4 border-black text-black font-[family-name:var(--font-outfit)] font-black text-xl uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] shadow-hard hover:shadow-hard-sm active:shadow-none transition-all flex items-center justify-center gap-3"
            >
              <span>Simpan</span>
              <span className="material-symbols-outlined text-[28px]">save</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
```

**Step 2: Verify build**

```bash
npm run build 2>&1 | tail -10
```

**Step 3: Commit**

```bash
git add app/log/[id]/page.tsx
git commit -m "feat: rewrite daily log form with Bauhaus design"
```

---

## Task 5: Personal Dashboard Rewrite (`app/dashboard/[id]/page.tsx`)

**Files:**
- Modify: `app/dashboard/[id]/page.tsx`

**Step 1: Rewrite dashboard**

Reference mockup: `draft_ui/personal_dashboard/code.html`

Key elements:
- Red circle back button, points badge top-right
- "PERSONAL DASHBOARD" subtitle, large name
- Blue oval Total Puasa card, yellow Total Olahraga card
- Red "ISI JURNAL" CTA button
- Riwayat section with colored left-border bars and status badges
- BottomNav component at bottom

```tsx
"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { users, historicalLogs, getUserStats } from "@/lib/mockData";
import type { PuasaStatus } from "@/lib/mockData";
import BottomNav from "@/components/BottomNav";

const borderColors: Record<PuasaStatus, string> = {
  full: "bg-bauhaus-red",
  half: "bg-bauhaus-yellow",
  none: "bg-gray-300",
};

const statusLabels: Record<PuasaStatus, { text: string; style: string }> = {
  full: { text: "SELESAI", style: "bg-black text-white" },
  half: { text: "PARSIAL", style: "border-2 border-black bg-transparent text-black" },
  none: { text: "KOSONG", style: "bg-gray-300 text-gray-700" },
};

export default function DashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const user = users.find((u) => u.id === id);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 border-4 border-black bg-white shadow-hard">
          <p className="text-lg font-bold uppercase">Anggota keluarga tidak ditemukan.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-bauhaus-blue text-white font-bold px-4 py-2 border-2 border-black"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const stats = getUserStats(id);
  const recentDays = historicalLogs.slice(-3).reverse();

  const puasaLabel: Record<PuasaStatus, string> = {
    full: "Puasa",
    half: "Setengah Hari",
    none: "Tidak Puasa",
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-0 sm:p-4 font-[family-name:var(--font-inter)] text-bauhaus-black">
      <main className="relative z-10 w-full max-w-[480px] bg-white min-h-screen sm:min-h-[800px] border-4 border-black shadow-hard flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white p-6 pb-0 flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <button
              onClick={() => router.push("/")}
              aria-label="Kembali ke beranda"
              className="flex items-center justify-center w-16 h-16 bg-bauhaus-red rounded-full border-4 border-black shadow-hard-sm hover:translate-y-1 hover:shadow-none transition-all text-white"
            >
              <span className="material-symbols-outlined text-3xl">arrow_back</span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-bauhaus-white border-4 border-black shadow-hard-sm">
              <span className="material-symbols-outlined text-black text-[24px]">stars</span>
              <span className="text-black text-lg font-black">{user.points.toLocaleString("id-ID")}</span>
            </div>
          </div>
          <div className="mt-4 pb-6">
            <p className="text-lg font-medium text-gray-500 uppercase tracking-widest mb-1">Personal Dashboard</p>
            <h1 className="text-6xl font-[family-name:var(--font-outfit)] font-black text-black uppercase leading-[0.85] tracking-tight">
              {user.name}
            </h1>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-8">
          {/* Stats Cards */}
          <div className="flex flex-col gap-6">
            {/* Total Puasa - Blue Oval */}
            <div className="relative w-full aspect-[2/1] flex items-center justify-center bg-bauhaus-blue rounded-full border-4 border-black shadow-hard">
              <div className="text-center text-white flex flex-col items-center">
                <span className="material-symbols-outlined text-5xl mb-2">nights_stay</span>
                <p className="text-7xl font-[family-name:var(--font-outfit)] font-black">{stats.puasaPenuh}</p>
                <p className="text-xl font-bold uppercase tracking-wider mt-1">Total Puasa</p>
              </div>
            </div>

            {/* Total Olahraga - Yellow Card */}
            <div className="relative w-full p-8 bg-bauhaus-yellow border-4 border-black shadow-hard flex items-center justify-between hover:-translate-y-1 transition-transform">
              <div className="flex flex-col">
                <p className="text-6xl font-[family-name:var(--font-outfit)] font-black text-black">{stats.olahraga}</p>
                <p className="text-lg font-bold text-black uppercase tracking-wider">Total Olahraga</p>
              </div>
              <div className="w-16 h-16 bg-black flex items-center justify-center text-bauhaus-yellow">
                <span className="material-symbols-outlined text-4xl">fitness_center</span>
              </div>
            </div>
          </div>

          {/* ISI JURNAL CTA */}
          <Link
            href={`/log/${id}`}
            className="w-full py-6 bg-bauhaus-red border-4 border-black shadow-hard hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all active:bg-red-700 text-white font-[family-name:var(--font-outfit)] font-black text-2xl uppercase tracking-wider flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined text-3xl">edit_square</span>
            ISI JURNAL
          </Link>

          {/* Riwayat */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b-4 border-black pb-2">
              <h3 className="text-2xl font-[family-name:var(--font-outfit)] font-black text-black uppercase">Riwayat</h3>
              <Link href="/history" className="text-sm font-bold text-black hover:bg-black hover:text-white px-2 py-1 transition-colors uppercase">
                Lihat Semua
              </Link>
            </div>
            <div className="flex flex-col gap-0">
              {recentDays.map((log, idx) => {
                const rec = log.records[id];
                if (!rec) return null;
                const colors = [borderColors.full, borderColors[rec.puasa], borderColors.half];
                const borderColor = colors[idx % 3];
                const status = statusLabels[rec.puasa];
                return (
                  <button
                    type="button"
                    key={log.day}
                    onClick={() => router.push(`/log/${id}?day=${log.day}`)}
                    className="flex group relative pl-4 py-4 border-b-2 border-black/10 hover:bg-gray-50 transition-colors cursor-pointer text-left"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-2 ${borderColor}`} />
                    <div className="flex-1 px-2">
                      <div className="flex justify-between items-baseline mb-1">
                        <p className="text-xl font-bold text-black">Ramadhan {log.day}</p>
                        <span className={`text-xs font-black uppercase px-2 py-0.5 ${status.style}`}>{status.text}</span>
                      </div>
                      <div className="flex gap-4 text-sm font-medium text-gray-600">
                        <span>{puasaLabel[rec.puasa]}</span>
                        {rec.ngaji && <span>Tadarus</span>}
                        {rec.olahraga && <span className="text-bauhaus-red">Olahraga</span>}
                      </div>
                    </div>
                    <div className="flex items-center pr-2">
                      <span className="material-symbols-outlined text-black text-3xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Nav */}
        <BottomNav />
      </main>
    </div>
  );
}
```

**Step 2: Verify build**

```bash
npm run build 2>&1 | tail -10
```

**Step 3: Commit**

```bash
git add app/dashboard/[id]/page.tsx
git commit -m "feat: rewrite personal dashboard with Bauhaus design"
```

---

## Task 6: History Matrix Rewrite (`app/history/page.tsx`)

**Files:**
- Modify: `app/history/page.tsx`

**Step 1: Rewrite history matrix**

Reference mockup: `draft_ui/history_matrix_calendar/code.html`

Key elements:
- Sticky header with back button, skewed "RIWAYAT RAMADHAN" title, "1447H" year badge
- Summary cards: 4 family members in a grid with shaped avatar badges (square/circle/triangle/arch), total puasa counts
- Matrix table: blue header, sticky left column, cells show green circles / yellow triangles / red X + activity icons
- Legend section at bottom
- No BottomNav on this page

```tsx
import Link from "next/link";
import { users, historicalLogs, getUserStats } from "@/lib/mockData";
import type { PuasaStatus } from "@/lib/mockData";

const avatarStyles: Record<string, { bg: string; shape: string }> = {
  ayah:   { bg: "bg-bauhaus-blue", shape: "rounded-none" },
  ibu:    { bg: "bg-bauhaus-red", shape: "rounded-full" },
  hafizh: { bg: "bg-bauhaus-yellow text-bauhaus-black", shape: "[clip-path:polygon(50%_0%,0%_100%,100%_100%)]" },
  hasna:  { bg: "bg-bauhaus-black", shape: "rounded-t-full rounded-b-none" },
};

function PuasaCell({ status }: { status: PuasaStatus }) {
  if (status === "full") {
    return <div className="w-8 h-8 rounded-full bg-bauhaus-green border-2 border-bauhaus-black" />;
  }
  if (status === "half") {
    return <div className="triangle drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" />;
  }
  return (
    <span
      className="material-symbols-outlined text-4xl text-bauhaus-red font-black"
      style={{ textShadow: "2px 2px 0 #000" }}
    >
      close
    </span>
  );
}

export default function HistoryPage() {
  return (
    <div className="bg-bauhaus-white min-h-screen text-bauhaus-black flex flex-col font-[family-name:var(--font-inter)]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-bauhaus-white border-b-4 border-bauhaus-black px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              aria-label="Kembali ke beranda"
              className="w-10 h-10 flex items-center justify-center bg-bauhaus-black text-white hover:bg-bauhaus-red transition-colors border-2 border-bauhaus-black"
            >
              <span className="material-symbols-outlined font-bold">arrow_back</span>
            </Link>
            <h1 className="text-2xl font-[family-name:var(--font-outfit)] font-black uppercase tracking-tighter -skew-x-6">
              Riwayat Ramadhan
            </h1>
          </div>
          <div className="flex items-center border-2 border-bauhaus-black bg-bauhaus-yellow px-4 py-2 shadow-hard-sm">
            <span className="material-symbols-outlined mr-2">calendar_month</span>
            <span className="font-bold font-mono text-lg">1447H</span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 space-y-12">
        {/* Summary Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-0 border-4 border-bauhaus-black bg-bauhaus-white shadow-hard">
          {users.map((user, idx) => {
            const stats = getUserStats(user.id);
            const style = avatarStyles[user.id] ?? { bg: "bg-gray-500", shape: "rounded-full" };
            return (
              <div
                key={user.id}
                className={`p-6 flex flex-col items-center justify-center text-center gap-3
                  ${idx < 3 ? "border-r-4 border-bauhaus-black" : ""}
                  ${idx < 2 ? "border-b-4 md:border-b-0 border-bauhaus-black" : ""}
                  hover:bg-gray-50 transition-colors`}
              >
                <div className={`w-12 h-12 ${style.bg} text-white flex items-center justify-center font-black text-xl border-2 border-bauhaus-black ${style.shape}`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="block text-4xl font-black tracking-tighter">{stats.puasaPenuh}</span>
                  <span className="text-sm font-bold uppercase tracking-widest bg-bauhaus-black text-white px-2 py-0.5">
                    {user.name}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Matrix Table */}
        <section className="border-4 border-bauhaus-black bg-bauhaus-white shadow-hard overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-bauhaus-blue text-white">
                  <th className="p-4 border-r-4 border-b-4 border-bauhaus-black w-32 sticky left-0 bg-bauhaus-blue z-20">
                    <span className="text-lg font-black uppercase tracking-wider">Hari</span>
                  </th>
                  {users.map((user) => (
                    <th key={user.id} className="p-4 text-center border-r-4 last:border-r-0 border-b-4 border-bauhaus-black w-1/4">
                      <span className="text-base font-bold uppercase tracking-widest">{user.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {historicalLogs.map((log, logIdx) => (
                  <tr key={log.day}>
                    <td className={`p-4 font-bold font-mono text-bauhaus-black sticky left-0 bg-bauhaus-white border-r-4 border-bauhaus-black z-10
                      ${logIdx < historicalLogs.length - 1 ? "border-b-4" : ""}`}
                    >
                      {String(log.day).padStart(2, "0")}
                      <span className="text-xs uppercase block text-gray-500">Ramadhan</span>
                    </td>
                    {users.map((user) => {
                      const rec = log.records[user.id];
                      return (
                        <td
                          key={user.id}
                          className={`p-0 border-r-4 last:border-r-0 border-bauhaus-black relative h-20 w-20 hover:bg-gray-50 transition-colors
                            ${logIdx < historicalLogs.length - 1 ? "border-b-4" : ""}`}
                        >
                          {rec ? (
                            <Link
                              href={`/log/${user.id}?day=${log.day}`}
                              className="absolute inset-0 flex items-center justify-center"
                              aria-label={`Edit ${user.name} Hari ${log.day}`}
                            >
                              <PuasaCell status={rec.puasa} />
                            </Link>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-300">-</div>
                          )}
                          {rec && (rec.ngaji || rec.olahraga) && (
                            <div className="absolute top-1 right-1 flex flex-col gap-1 pointer-events-none">
                              {rec.ngaji && <span className="material-symbols-outlined text-[16px] text-bauhaus-black">menu_book</span>}
                              {rec.olahraga && <span className="material-symbols-outlined text-[16px] text-bauhaus-black">fitness_center</span>}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Legend */}
        <section className="border-4 border-bauhaus-black bg-white p-6 md:p-8 space-y-6 shadow-hard">
          <h3 className="text-xl font-[family-name:var(--font-outfit)] font-black uppercase tracking-widest border-b-4 border-bauhaus-black pb-2 inline-block">
            Legenda
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold uppercase text-sm text-gray-500">Status Harian</h4>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center border-2 border-bauhaus-black bg-gray-50">
                  <div className="w-6 h-6 rounded-full bg-bauhaus-green border-2 border-bauhaus-black" />
                </div>
                <div>
                  <p className="font-black text-bauhaus-black">Hijau (Lengkap)</p>
                  <p className="text-sm text-gray-600 font-mono">Semua target ibadah tercapai.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center border-2 border-bauhaus-black bg-gray-50">
                  <div className="triangle scale-75" />
                </div>
                <div>
                  <p className="font-black text-bauhaus-black">Kuning (Sebagian)</p>
                  <p className="text-sm text-gray-600 font-mono">Ada target yang terlewat.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center border-2 border-bauhaus-black bg-gray-50">
                  <span className="material-symbols-outlined text-3xl text-bauhaus-red font-black" style={{ textShadow: "1px 1px 0 #000" }}>close</span>
                </div>
                <div>
                  <p className="font-black text-bauhaus-black">Merah (Kosong)</p>
                  <p className="text-sm text-gray-600 font-mono">Belum ada data atau tidak mengisi.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold uppercase text-sm text-gray-500">Indikator Aktivitas</h4>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center border-2 border-bauhaus-black bg-gray-50">
                  <span className="material-symbols-outlined text-bauhaus-black">menu_book</span>
                </div>
                <div>
                  <p className="font-black text-bauhaus-black">Ikon Buku</p>
                  <p className="text-sm text-gray-600 font-mono">Tadarus Al-Qur&apos;an</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center border-2 border-bauhaus-black bg-gray-50">
                  <span className="material-symbols-outlined text-bauhaus-black">fitness_center</span>
                </div>
                <div>
                  <p className="font-black text-bauhaus-black">Ikon Barbel</p>
                  <p className="text-sm text-gray-600 font-mono">Olahraga Ringan</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
```

**Step 2: Verify build**

```bash
npm run build 2>&1 | tail -10
```

**Step 3: Commit**

```bash
git add app/history/page.tsx
git commit -m "feat: rewrite history matrix with Bauhaus design"
```

---

## Task 7: Final Build Verification & Visual Check

**Step 1: Full build check**

```bash
npm run build
```
Expected: All pages build successfully with no TypeScript or JSX errors.

**Step 2: Start dev server and visually verify all pages**

```bash
npm run dev
```

Check these URLs in browser:
- `http://localhost:3000` — Homepage with Bauhaus leaderboard + journal grid
- `http://localhost:3000/dashboard/ayah` — Ayah's dashboard with blue puasa oval, yellow olahraga card
- `http://localhost:3000/log/ayah` — Daily log form with radio cards and toggles
- `http://localhost:3000/log/ayah?day=3` — Edit mode for day 3
- `http://localhost:3000/history` — History matrix with colored indicators

**Step 3: Fix any visual issues found during verification**

Iterate on spacing, colors, or layout as needed.

**Step 4: Final commit if any fixes were made**

```bash
git add -A
git commit -m "fix: polish Bauhaus UI visual details"
```
