import Link from "next/link";
import { ArrowLeft, Moon, BookOpen, Activity } from "lucide-react";
import { users, historicalLogs } from "@/lib/mockData";
import type { PuasaStatus } from "@/lib/mockData";

const puasaDot: Record<PuasaStatus, string> = {
  full: "bg-emerald-500",
  half: "bg-yellow-400",
  none: "bg-gray-300",
};

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-green-50">
      {/* ── Header ── */}
      <header className="bg-emerald-700 text-white py-5 px-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            href="/"
            aria-label="Kembali ke beranda"
            className="p-2 rounded-xl hover:bg-emerald-600 active:bg-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Moon className="w-6 h-6 text-yellow-300 fill-yellow-300" />
          <div>
            <h1 className="text-lg font-bold leading-tight">Riwayat Ramadhan</h1>
            <p className="text-emerald-200 text-sm">Rekap ibadah keluarga</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* ── Legend ── */}
        <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Penuh</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400" /> Setengah</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-gray-300" /> Tidak</span>
          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-emerald-500" /> Ngaji</span>
          <span className="flex items-center gap-1"><Activity className="w-3 h-3 text-blue-500" /> Olahraga</span>
        </div>

        {/* ── Matrix Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-xs font-bold text-emerald-900 py-2 px-3 sticky left-0 bg-green-50">
                  Hari
                </th>
                {users.map((user) => (
                  <th key={user.id} className="text-center text-xs font-bold text-emerald-900 py-2 px-3">
                    <span className="text-lg block">{user.avatar}</span>
                    {user.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historicalLogs.map((log) => (
                <tr key={log.day} className="border-t border-green-100">
                  <td className="py-3 px-3 sticky left-0 bg-green-50">
                    <p className="text-sm font-bold text-emerald-800">Hari {log.day}</p>
                    <p className="text-[10px] text-gray-400">{log.date}</p>
                  </td>
                  {users.map((user) => {
                    const rec = log.records[user.id];
                    if (!rec) return <td key={user.id} />;
                    return (
                      <td key={user.id} className="py-3 px-3 text-center">
                        <Link
                          href={`/log/${user.id}?day=${log.day}`}
                          className="flex items-center justify-center gap-1.5 rounded-lg p-1
                                     hover:bg-emerald-50 transition-colors"
                          aria-label={`Edit catatan ${user.name} Hari ${log.day}`}
                        >
                          <span aria-hidden="true" className={`w-3 h-3 rounded-full ${puasaDot[rec.puasa]}`} />
                          {rec.ngaji && <BookOpen className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />}
                          {rec.olahraga && <Activity className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />}
                        </Link>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="text-center text-xs text-emerald-400 pt-6 pb-4">
          Ramadhan Mubarak
        </footer>
      </div>
    </main>
  );
}
