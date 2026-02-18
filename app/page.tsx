import Link from "next/link";
import { leaderboard, users, historicalLogs } from "@/lib/mockData";

const rankBadgeColors = [
  "",
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
