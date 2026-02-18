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
