import Link from "next/link";
import { users, historicalLogs, getUserStats } from "@/lib/mockData";
import type { PuasaStatus } from "@/lib/mockData";

const avatarStyles: Record<string, { bg: string; shape: string }> = {
  ayah:   { bg: "bg-bauhaus-blue", shape: "rounded-none" },
  ibu:    { bg: "bg-bauhaus-red", shape: "rounded-full" },
  hafizh: { bg: "bg-bauhaus-yellow text-bauhaus-black", shape: "" },
  hasna:  { bg: "bg-bauhaus-black", shape: "rounded-t-full rounded-b-none" },
};

function PuasaCell({ status }: { status: PuasaStatus }) {
  if (status === "full") {
    return <div className="w-8 h-8 rounded-full bg-bauhaus-green border-2 border-bauhaus-black" />;
  }
  if (status === "half") {
    return <div className="triangle" style={{ filter: "drop-shadow(2px 2px 0px rgba(0,0,0,1))" }} />;
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
            const isHafizh = user.id === "hafizh";
            return (
              <div
                key={user.id}
                className={`p-6 flex flex-col items-center justify-center text-center gap-3
                  ${idx < users.length - 1 ? "border-r-4 border-bauhaus-black" : ""}
                  ${idx < 2 ? "border-b-4 md:border-b-0 border-bauhaus-black" : ""}
                  hover:bg-gray-50 transition-colors`}
              >
                <div
                  className={`w-12 h-12 ${style.bg} text-white flex items-center justify-center font-black text-xl border-2 border-bauhaus-black ${style.shape}`}
                  style={isHafizh ? { clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" } : undefined}
                >
                  {isHafizh ? <span className="mt-2">{user.name.charAt(0)}</span> : user.name.charAt(0)}
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
