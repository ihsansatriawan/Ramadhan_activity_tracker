import Link from "next/link";
import { Moon, Trophy, Star, BookOpen, ChevronRight } from "lucide-react";
import { leaderboard, users } from "@/lib/mockData";

const rankColors = [
  "bg-yellow-400 text-yellow-900",   // 1st – gold
  "bg-slate-300 text-slate-800",     // 2nd – silver
  "bg-amber-600 text-amber-50",      // 3rd – bronze
  "bg-emerald-100 text-emerald-800", // 4th+
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-green-50">
      {/* ── Header ── */}
      <header className="bg-emerald-700 text-white py-6 px-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Moon className="w-8 h-8 text-yellow-300 fill-yellow-300" />
          <div>
            <h1 className="text-xl font-bold tracking-tight leading-tight">
              Jurnal Ramadhan Keluarga
            </h1>
            <p className="text-emerald-200 text-sm mt-0.5">
              Bismillah, semangat ibadah bersama!
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-8">

        {/* ── Section 1: Leaderboard ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-bold text-emerald-900">Leaderboard</h2>
          </div>

          <div className="space-y-3">
            {leaderboard.map((user, index) => {
              const isFirst = index === 0;
              const badgeClass = rankColors[index] ?? rankColors[3];

              return (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 p-4 rounded-2xl shadow-sm border transition-transform
                    ${isFirst
                      ? "bg-yellow-50 border-yellow-300 shadow-yellow-100"
                      : "bg-white border-green-100"
                    }`}
                >
                  {/* Rank badge */}
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${badgeClass}`}
                  >
                    {index + 1}
                  </span>

                  {/* Avatar */}
                  <span className="text-3xl leading-none">{user.avatar}</span>

                  {/* Name */}
                  <div className="flex-1">
                    <p className={`font-semibold ${isFirst ? "text-yellow-800" : "text-emerald-900"}`}>
                      {user.name}
                    </p>
                    {isFirst && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs text-yellow-600 font-medium">Juara Keluarga</span>
                      </div>
                    )}
                  </div>

                  {/* Points + trophy for 1st */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isFirst && (
                      <Trophy className="w-4 h-4 text-yellow-500" />
                    )}
                    <span className={`text-lg font-bold ${isFirst ? "text-yellow-700" : "text-emerald-700"}`}>
                      {user.points}
                    </span>
                    <span className={`text-xs ${isFirst ? "text-yellow-500" : "text-emerald-400"}`}>pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Section 2: Isi Jurnal Hari Ini ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-emerald-900">Isi Jurnal Hari Ini</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {users.map((user) => (
              <Link
                key={user.id}
                href={`/log/${user.id}`}
                className="group bg-white border border-green-100 rounded-2xl p-5 shadow-sm
                           flex flex-col items-center gap-3 text-center
                           hover:border-emerald-400 hover:shadow-md hover:bg-emerald-50
                           active:scale-95 transition-all duration-150"
              >
                <span className="text-4xl leading-none">{user.avatar}</span>
                <p className="font-semibold text-emerald-900 text-sm">{user.name}</p>
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium
                                group-hover:text-emerald-700">
                  <span>Isi Jurnal</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="text-center text-xs text-emerald-400 pb-4">
          Ramadhan Mubarak 🌙
        </footer>
      </div>
    </main>
  );
}
