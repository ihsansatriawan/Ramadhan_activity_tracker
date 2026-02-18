"use client";

import { use, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { users, historicalLogs, puasaStatusToOption } from "@/lib/mockData";
import type { PuasaOption } from "@/lib/mockData";

const PUASA_OPTIONS: { value: PuasaOption; label: string; selectedBg: string; selectedText: string }[] = [
  { value: "Tidak Puasa", label: "Tidak", selectedBg: "bg-bauhaus-red", selectedText: "text-white" },
  { value: "Setengah Hari", label: "Setengah", selectedBg: "bg-bauhaus-yellow", selectedText: "text-black" },
  { value: "Puasa Penuh", label: "Penuh", selectedBg: "bg-bauhaus-blue", selectedText: "text-white" },
];

function getDayName(dateStr: string): string {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const d = new Date(dateStr + "T00:00:00");
  return days[d.getDay()];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function LogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const user = users.find((u) => u.id === id);

  const searchParams = useSearchParams();
  const dayParam = searchParams.get("day");
  const editDay = dayParam ? Number(dayParam) : null;

  const editLog = editDay ? historicalLogs.find((l) => l.day === editDay) : null;
  const editRecord = editLog?.records[id] ?? null;

  const currentDay = editDay ?? historicalLogs.length + 1;
  const currentDate = editLog?.date ?? new Date().toISOString().split("T")[0];

  const [puasa, setPuasa] = useState<PuasaOption>(
    editRecord ? puasaStatusToOption(editRecord.puasa) : "Puasa Penuh"
  );
  const [ngaji, setNgaji] = useState(editRecord?.ngaji ?? false);
  const [olahraga, setOlahraga] = useState(editRecord?.olahraga ?? false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (editRecord) {
      setPuasa(puasaStatusToOption(editRecord.puasa));
      setNgaji(editRecord.ngaji);
      setOlahraga(editRecord.olahraga);
    } else {
      setPuasa("Puasa Penuh");
      setNgaji(false);
      setOlahraga(false);
    }
    setSaved(false);
  }, [editDay]); // eslint-disable-line react-hooks/exhaustive-deps

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

  function handleSimpan() {
    setSaved(true);
    setTimeout(() => {
      router.push(editDay ? `/dashboard/${id}` : "/");
    }, 1500);
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-0 sm:p-4 font-[family-name:var(--font-inter)] text-bauhaus-black">
      <main className="w-full max-w-md bg-white border-4 border-black shadow-hard relative z-10 min-h-screen sm:min-h-0 sm:h-[850px] flex flex-col">
        {/* Header */}
        <header className="bg-white border-b-4 border-black px-6 py-6 flex flex-col justify-end min-h-[140px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-full bg-bauhaus-red skew-x-12 translate-x-10 z-0 border-l-4 border-black" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => router.back()}
                aria-label="Kembali"
                className="w-10 h-10 flex items-center justify-center border-2 border-black bg-white hover:bg-black hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined font-bold">arrow_back</span>
              </button>
              <span className="font-mono text-xs uppercase tracking-widest border border-black px-2 py-1 bg-bauhaus-yellow">
                Ramadhan Day {currentDay}
              </span>
            </div>
            <h1 className="text-7xl font-[family-name:var(--font-outfit)] font-black leading-none tracking-tighter mt-2">
              LOG
            </h1>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Day Info Bar */}
          <div className="px-6 py-6 border-b-4 border-black bg-white flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-tight">{getDayName(currentDate)}</h2>
              <p className="font-mono text-sm text-gray-600">{formatDate(currentDate)}</p>
            </div>
            <div className="w-12 h-12 bg-black rounded-full" />
          </div>

          {/* Status Puasa */}
          <div className="px-6 py-8">
            <h3 className="font-[family-name:var(--font-outfit)] font-black text-xl mb-6 uppercase border-l-8 border-bauhaus-blue pl-3 leading-none">
              Status Puasa
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {PUASA_OPTIONS.map((option) => {
                const isSelected = puasa === option.value;
                return (
                  <label key={option.value} className="cursor-pointer group relative">
                    <input
                      type="radio"
                      name="fasting_status"
                      className="peer sr-only"
                      checked={isSelected}
                      onChange={() => setPuasa(option.value)}
                    />
                    <div className={`aspect-square border-4 border-black flex flex-col items-center justify-center gap-2 transition-all
                      ${isSelected ? `${option.selectedBg} ${option.selectedText} shadow-hard-sm` : "bg-white group-hover:translate-x-1 group-hover:translate-y-1"}`}
                    >
                      <div className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center bg-white">
                        {isSelected && <div className="w-3 h-3 rounded-full bg-current" />}
                      </div>
                      <span className="font-bold text-sm uppercase">{option.label}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="h-4 border-y-4 border-black" />

          {/* Rutinitas */}
          <div className="px-6 py-8 space-y-8 bg-white">
            <h3 className="font-[family-name:var(--font-outfit)] font-black text-xl mb-6 uppercase border-l-8 border-bauhaus-red pl-3 leading-none">
              Rutinitas
            </h3>

            {/* Ngaji Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-lg uppercase">Ngaji</h4>
                <p className="text-xs font-mono bg-black text-white px-1 inline-block mt-1">READING</p>
              </div>
              <button
                type="button"
                onClick={() => setNgaji(!ngaji)}
                className={`relative w-24 h-12 border-4 border-black rounded-full overflow-hidden transition-colors ${ngaji ? "bg-bauhaus-yellow" : "bg-gray-200"}`}
                aria-label={`Ngaji: ${ngaji ? "aktif" : "nonaktif"}`}
              >
                <div className={`absolute top-0.5 w-10 h-10 bg-white border-4 border-black rounded-full transition-all flex items-center justify-center shadow-sm ${ngaji ? "left-12" : "left-0.5"}`}>
                  <div className="w-2 h-2 bg-black rounded-full" />
                </div>
              </button>
            </div>

            {/* Olahraga Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-lg uppercase">Olahraga</h4>
                <p className="text-xs font-mono bg-black text-white px-1 inline-block mt-1">SPORT</p>
              </div>
              <button
                type="button"
                onClick={() => setOlahraga(!olahraga)}
                className={`relative w-24 h-12 border-4 border-black rounded-full overflow-hidden transition-colors ${olahraga ? "bg-bauhaus-blue" : "bg-gray-200"}`}
                aria-label={`Olahraga: ${olahraga ? "aktif" : "nonaktif"}`}
              >
                <div className={`absolute top-0.5 w-10 h-10 bg-white border-4 border-black rounded-full transition-all flex items-center justify-center shadow-sm ${olahraga ? "left-12" : "left-0.5"}`}>
                  <div className="w-2 h-2 bg-black rounded-full" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Save Button (sticky bottom) */}
        <div className="p-4 bg-white border-t-4 border-black z-20">
          {saved ? (
            <div className="w-full py-4 bg-bauhaus-green border-4 border-black text-white font-[family-name:var(--font-outfit)] font-black text-xl uppercase tracking-widest flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
              Tersimpan!
            </div>
          ) : (
            <button
              onClick={handleSimpan}
              className="w-full py-4 bg-bauhaus-yellow border-4 border-black text-black font-[family-name:var(--font-outfit)] font-black text-xl uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] shadow-hard hover:shadow-hard-sm active:shadow-none transition-all flex items-center justify-center gap-3"
            >
              <span>Simpan</span>
              <span className="material-symbols-outlined text-[28px]">save</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
