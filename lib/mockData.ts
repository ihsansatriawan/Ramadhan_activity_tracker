export interface User {
  id: string;
  name: string;
  points: number;
  avatar: string;
}

const rawUsers: User[] = [
  { id: "ayah", name: "Ayah", points: 350, avatar: "👨" },
  { id: "ibu", name: "Ibu", points: 420, avatar: "👩" },
  { id: "hafizh", name: "Hafizh", points: 280, avatar: "👦" },
  { id: "hasna", name: "Hasna", points: 300, avatar: "👧" },
];

// Sorted descending by points for the Leaderboard
export const leaderboard: User[] = [...rawUsers].sort(
  (a, b) => b.points - a.points
);

// Original list for member cards (preserves display order)
export const users: User[] = rawUsers;

export type PuasaOption = "Puasa Penuh" | "Setengah Hari" | "Tidak Puasa";

export interface DailyLog {
  userId: string;
  puasa: PuasaOption;
  ngaji: boolean;
  olahraga: boolean;
}

// ── Historical Data (Phase 1.5) ──

export type PuasaStatus = "full" | "half" | "none";

export interface DayRecord {
  puasa: PuasaStatus;
  ngaji: boolean;
  olahraga: boolean;
}

export interface HistoricalLog {
  day: number;
  date: string;
  records: Record<string, DayRecord>;
}

export const historicalLogs: HistoricalLog[] = [
  {
    day: 1, date: "2026-02-18",
    records: {
      ayah:   { puasa: "full", ngaji: true,  olahraga: true },
      ibu:    { puasa: "full", ngaji: true,  olahraga: false },
      hafizh: { puasa: "full", ngaji: true,  olahraga: true },
      hasna:  { puasa: "full", ngaji: true,  olahraga: false },
    },
  },
  {
    day: 2, date: "2026-02-19",
    records: {
      ayah:   { puasa: "full", ngaji: true,  olahraga: false },
      ibu:    { puasa: "full", ngaji: true,  olahraga: true },
      hafizh: { puasa: "half", ngaji: false, olahraga: true },
      hasna:  { puasa: "full", ngaji: true,  olahraga: true },
    },
  },
  {
    day: 3, date: "2026-02-20",
    records: {
      ayah:   { puasa: "full", ngaji: false, olahraga: true },
      ibu:    { puasa: "full", ngaji: true,  olahraga: true },
      hafizh: { puasa: "full", ngaji: true,  olahraga: false },
      hasna:  { puasa: "half", ngaji: true,  olahraga: false },
    },
  },
  {
    day: 4, date: "2026-02-21",
    records: {
      ayah:   { puasa: "full", ngaji: true,  olahraga: true },
      ibu:    { puasa: "half", ngaji: true,  olahraga: false },
      hafizh: { puasa: "full", ngaji: true,  olahraga: true },
      hasna:  { puasa: "full", ngaji: false, olahraga: true },
    },
  },
  {
    day: 5, date: "2026-02-22",
    records: {
      ayah:   { puasa: "full", ngaji: true,  olahraga: false },
      ibu:    { puasa: "full", ngaji: true,  olahraga: true },
      hafizh: { puasa: "none", ngaji: false, olahraga: false },
      hasna:  { puasa: "full", ngaji: true,  olahraga: true },
    },
  },
  {
    day: 6, date: "2026-02-23",
    records: {
      ayah:   { puasa: "half", ngaji: true,  olahraga: true },
      ibu:    { puasa: "full", ngaji: true,  olahraga: false },
      hafizh: { puasa: "full", ngaji: true,  olahraga: true },
      hasna:  { puasa: "full", ngaji: true,  olahraga: false },
    },
  },
  {
    day: 7, date: "2026-02-24",
    records: {
      ayah:   { puasa: "full", ngaji: true,  olahraga: true },
      ibu:    { puasa: "full", ngaji: false, olahraga: true },
      hafizh: { puasa: "full", ngaji: true,  olahraga: true },
      hasna:  { puasa: "full", ngaji: true,  olahraga: true },
    },
  },
];

export function getUserStats(userId: string) {
  let puasaPenuh = 0;
  let ngaji = 0;
  let olahraga = 0;

  for (const log of historicalLogs) {
    const rec = log.records[userId];
    if (!rec) continue;
    if (rec.puasa === "full") puasaPenuh++;
    if (rec.ngaji) ngaji++;
    if (rec.olahraga) olahraga++;
  }

  return { puasaPenuh, ngaji, olahraga, totalDays: historicalLogs.length };
}

const statusToOption: Record<PuasaStatus, PuasaOption> = {
  full: "Puasa Penuh",
  half: "Setengah Hari",
  none: "Tidak Puasa",
};

export function puasaStatusToOption(status: PuasaStatus): PuasaOption {
  return statusToOption[status];
}
