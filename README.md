# Jurnal Ramadhan Keluarga

A family Ramadan activity tracker built with Next.js. Track daily ibadah (worship activities) together as a family, with a leaderboard to keep everyone motivated.

## Features

- **Family Leaderboard** — See who has the most points in your family
- **Daily Journal** — Each family member can log their daily Ramadan activities
- **Activity Tracking** — Track Sholat, Quran recitation, Sahur, and more

## Tech Stack

- [Next.js 15](https://nextjs.org/) — React framework
- [Tailwind CSS v4](https://tailwindcss.com/) — Styling
- [Lucide React](https://lucide.dev/) — Icons
- TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
├── app/
│   ├── page.tsx          # Home page — leaderboard + user selection
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Global styles
│   └── log/
│       └── [id]/
│           └── page.tsx  # Daily journal entry page per user
├── lib/
│   └── mockData.ts       # Mock data for users and activities
└── next.config.ts        # Next.js configuration
```
