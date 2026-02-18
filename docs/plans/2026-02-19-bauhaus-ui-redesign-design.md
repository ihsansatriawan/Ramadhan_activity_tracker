# Bauhaus UI Redesign — Design Document

**Date:** 2026-02-19
**Branch:** `feat/bauhaus-ui-redesign`
**Scope:** Full visual redesign of all 4 pages + shared infrastructure

## Decision Log

- **Full replacement** on a new branch (old green UI stays on main as reference)
- **Normalized palette** across all pages (mockups had slight per-page color variations)
- **Match mockups exactly** for fonts (Outfit + Inter) and icons (Material Symbols)
- **Add bottom navigation** bar as shown in dashboard mockup
- **Page-by-page rewrite** approach (Approach A)

## Design System

### Colors (Normalized)

| Token | Hex | Usage |
|-------|-----|-------|
| bauhaus-red | #D03025 | Accents, rank 3, CTA buttons |
| bauhaus-blue | #1C5BB8 | Headers, rank 2, selected states |
| bauhaus-yellow | #F7C924 | Rank 1 highlight, save buttons |
| bauhaus-black | #121212 | Text, borders, backgrounds |
| bauhaus-white | #F0F0F0 | Page background |
| bauhaus-green | #2E7D32 | History matrix "complete" indicator |

### Typography

- **Display:** Outfit (900/700/400) via `next/font/google`
- **Body:** Inter via `next/font/google`
- Style: Uppercase, tight tracking, font-black for headings

### Icons

Material Symbols Outlined via CDN link in `<head>`. Weight 700, no fill.

### Shadows

- `shadow-hard`: `8px 8px 0px 0px #000`
- `shadow-hard-sm`: `4px 4px 0px 0px #000`
- `shadow-hard-hover`: `12px 12px 0px 0px #000`

### Borders

4px solid black (`border-4 border-black`) is the signature visual element.

### Background

Dot-grid pattern on body: `radial-gradient(#121212 1px, transparent 1px)` with 20px spacing.

## Page Designs

### 1. Homepage (`app/page.tsx`)

- **Header:** "RAMADAN JURNAL" (text-5xl font-black uppercase), red circle decoration top-right, "KELUARGA" badge + dynamic "Hari ke-X"
- **Klasemen:** #1 = yellow card with star badge, avatar, "PEMIMPIN" tag, large points. #2-4 = white cards with colored rank badges (blue/red/black)
- **Isi Jurnal:** 2x2 grid, each card is a Bauhaus color (red=Ayah, blue=Ibu, yellow=Hafizh, white=Hasna) with avatar and name label
- **Footer:** "RIWAYAT RAMADHAN" blue full-width button
- Leaderboard rows link to `/dashboard/[id]`, journal cards link to `/log/[id]`

### 2. Daily Log (`app/log/[id]/page.tsx`)

- **Header:** Red diagonal accent, square back button, "RAMADHAN DAY X" yellow badge, large "LOG" title
- **Day bar:** Day name (uppercase) + date, black circle decoration
- **Status Puasa:** 3 square radio cards (TIDAK/SETENGAH/PENUH) with circle indicators. Selected = blue fill with white text
- **Rutinitas:** Bauhaus toggle switches for Ngaji and Olahraga with thick black borders and color fills
- **Simpan:** Yellow full-width button with save icon
- Remove existing "Ringkasan Hari Ini" summary card (not in mockup)

### 3. Personal Dashboard (`app/dashboard/[id]/page.tsx`)

- **Header:** Red circle back button (top-left), points badge with star icon (top-right), "PERSONAL DASHBOARD" subtitle, large name
- **Total Puasa:** Large blue oval/rounded card with moon icon and count
- **Total Olahraga:** Yellow card with dumbbell icon and count
- **ISI JURNAL:** Red CTA button
- **Riwayat:** Recent 3 days with colored left-border bars, day labels, status badges (SELESAI/PARSIAL), activity tags. Arrow icons on right.
- **Bottom nav:** 4-tab bar

### 4. History Matrix (`app/history/page.tsx`)

- **Header:** Sticky, black back button, "RIWAYAT RAMADHAN" (skewed text), "1447H" year badge (yellow)
- **Summary row:** 4 cards with shaped avatars (square=Ayah, circle=Ibu, triangle=Hafizh, arch=Hasna), total puasa counts, name labels
- **Matrix table:** Blue header row, sticky left column ("01 RAMADHAN", "02 RAMADHAN"...), cells with:
  - Green circle = full puasa
  - Yellow triangle = partial
  - Red X = none/empty
  - Small book/dumbbell icons in top-right corner for activities
- **"Lihat lebih banyak"** expand button
- **Legend section:** Explains all status indicators and activity icons

### 5. Bottom Navigation (Shared Component)

- `components/BottomNav.tsx` — 4 equal columns
- Icons: home, book_2, leaderboard, person
- Active tab: solid color fill (red for home)
- Hover: color transitions per tab
- Thick top border (4px black)
- Used on: Homepage, Dashboard. Not on Log or History (those have their own back navigation).

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `app/layout.tsx` | Edit | Add Outfit + Inter fonts, Material Symbols CDN, update body classes |
| `app/globals.css` | Edit | Add Bauhaus CSS custom properties, dot-grid bg, hard-shadow utilities |
| `app/page.tsx` | Rewrite | Bauhaus homepage with leaderboard + journal grid |
| `app/log/[id]/page.tsx` | Rewrite | Bauhaus daily log form |
| `app/dashboard/[id]/page.tsx` | Rewrite | Bauhaus personal dashboard |
| `app/history/page.tsx` | Rewrite | Bauhaus history matrix |
| `components/BottomNav.tsx` | New | Shared bottom navigation component |

## Non-Goals

- No new data model changes (Tarawih toggle shown in mockup is skipped — not in mock data)
- No real persistence — still using mock data
- No dark mode
- No responsive desktop layout (mobile-first as current)
