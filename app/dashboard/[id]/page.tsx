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

const puasaLabel: Record<PuasaStatus, string> = {
  full: "Puasa",
  half: "Setengah Hari",
  none: "Tidak Puasa",
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
              {recentDays.map((log) => {
                const rec = log.records[id];
                if (!rec) return null;
                const borderColor = borderColors[rec.puasa];
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
