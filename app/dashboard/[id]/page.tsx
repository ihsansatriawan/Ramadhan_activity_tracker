"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Moon, BookOpen, Activity, Utensils, ChevronRight, Pencil } from "lucide-react";
import { users, historicalLogs, getUserStats } from "@/lib/mockData";
import type { PuasaStatus } from "@/lib/mockData";

const puasaDot: Record<PuasaStatus, string> = {
  full: "bg-emerald-500",
  half: "bg-yellow-400",
  none: "bg-gray-300",
};

const puasaLabel: Record<PuasaStatus, string> = {
  full: "Penuh",
  half: "Setengah",
  none: "Tidak",
};

export default function DashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const user = users.find((u) => u.id === id);

  if (!user) {
    return (
      <main className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-gray-500 text-lg">Anggota keluarga tidak ditemukan.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 text-emerald-600 font-semibold underline"
          >
            Kembali ke beranda
          </button>
        </div>
      </main>
    );
  }

  const stats = getUserStats(id);
  const recentDays = historicalLogs.slice(-3).reverse();

  return (
    <main className="min-h-screen bg-green-50">
      {/* ── Header ── */}
      <header className="bg-emerald-700 text-white py-5 px-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            aria-label="Kembali ke beranda"
            className="p-2 rounded-xl hover:bg-emerald-600 active:bg-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-3xl leading-none">{user.avatar}</span>
          <div className="flex-1">
            <h1 className="text-lg font-bold leading-tight">{user.name}</h1>
            <p className="text-emerald-200 text-sm">{user.points} poin</p>
          </div>
          <Moon className="w-6 h-6 text-yellow-300 fill-yellow-300" />
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">

        {/* ── Quick Stats ── */}
        <section className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-green-100 rounded-2xl p-4 text-center shadow-sm">
            <Utensils className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-emerald-700">{stats.puasaPenuh}</p>
            <p className="text-[11px] text-gray-500 font-medium">Puasa Penuh</p>
          </div>
          <div className="bg-white border border-green-100 rounded-2xl p-4 text-center shadow-sm">
            <BookOpen className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-emerald-700">{stats.ngaji}</p>
            <p className="text-[11px] text-gray-500 font-medium">Ngaji</p>
          </div>
          <div className="bg-white border border-green-100 rounded-2xl p-4 text-center shadow-sm">
            <Activity className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-emerald-700">{stats.olahraga}</p>
            <p className="text-[11px] text-gray-500 font-medium">Olahraga</p>
          </div>
        </section>

        {/* ── CTA Button ── */}
        <button
          onClick={() => router.push(`/log/${id}`)}
          className="w-full flex items-center justify-center gap-2
                     bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800
                     text-white font-bold text-base py-4 rounded-2xl shadow-lg
                     transition-all duration-150 active:scale-95"
        >
          <BookOpen className="w-5 h-5" />
          Isi Jurnal Hari Ini
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* ── Recent History ── */}
        <section>
          <h2 className="text-sm font-bold text-emerald-900 mb-3">Riwayat 3 Hari Terakhir</h2>
          <div className="space-y-2">
            {recentDays.map((log) => {
              const rec = log.records[id];
              if (!rec) return null;
              return (
                <button
                  type="button"
                  key={log.day}
                  aria-label={`Edit catatan Hari ${log.day}`}
                  onClick={() => router.push(`/log/${id}?day=${log.day}`)}
                  className="w-full flex items-center gap-3 bg-white border border-green-100 rounded-xl p-3 shadow-sm
                             hover:border-emerald-300 hover:bg-emerald-50/50 active:scale-[0.98] transition-all duration-150 text-left"
                >
                  <div className="text-center shrink-0 w-12">
                    <p className="text-xs text-gray-400 font-medium">Hari</p>
                    <p className="text-lg font-bold text-emerald-800">{log.day}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <span className={`w-3 h-3 rounded-full shrink-0 ${puasaDot[rec.puasa]}`} />
                    <span className="text-xs text-gray-600">{puasaLabel[rec.puasa]}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {rec.ngaji && <BookOpen className="w-4 h-4 text-emerald-500" />}
                    {rec.olahraga && <Activity className="w-4 h-4 text-blue-500" />}
                    {!rec.ngaji && !rec.olahraga && (
                      <span className="text-xs text-gray-300">-</span>
                    )}
                  </div>
                  <Pencil className="w-3.5 h-3.5 text-gray-300 shrink-0" aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </section>

        <footer className="text-center text-xs text-emerald-400 pb-4">
          Ramadhan Mubarak
        </footer>
      </div>
    </main>
  );
}
