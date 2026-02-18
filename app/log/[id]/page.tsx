"use client";

import { use, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Moon, Utensils, BookOpen, Activity, CheckCircle2, Circle, Save } from "lucide-react";
import { users, historicalLogs, puasaStatusToOption } from "@/lib/mockData";
import type { PuasaOption } from "@/lib/mockData";

const PUASA_OPTIONS: PuasaOption[] = ["Puasa Penuh", "Setengah Hari", "Tidak Puasa"];

const puasaStyles: Record<PuasaOption, string> = {
  "Puasa Penuh":   "border-emerald-500 bg-emerald-50 text-emerald-800",
  "Setengah Hari": "border-yellow-400 bg-yellow-50 text-yellow-800",
  "Tidak Puasa":   "border-red-300 bg-red-50 text-red-700",
};

interface ToggleRowProps {
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: (val: boolean) => void;
}

function ToggleRow({ label, sublabel, icon, checked, onChange }: ToggleRowProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-150
        ${checked
          ? "border-emerald-500 bg-emerald-50"
          : "border-gray-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/40"
        }`}
    >
      <span className={`shrink-0 ${checked ? "text-emerald-600" : "text-gray-400"}`}>
        {icon}
      </span>
      <div className="flex-1">
        <p className={`font-semibold text-sm ${checked ? "text-emerald-900" : "text-gray-700"}`}>
          {label}
        </p>
        <p className={`text-xs mt-0.5 ${checked ? "text-emerald-600" : "text-gray-400"}`}>
          {checked ? "Sudah dilakukan" : sublabel}
        </p>
      </div>
      <span className={`shrink-0 transition-colors ${checked ? "text-emerald-500" : "text-gray-300"}`}>
        {checked
          ? <CheckCircle2 className="w-6 h-6 fill-emerald-100" />
          : <Circle className="w-6 h-6" />
        }
      </span>
    </button>
  );
}

export default function LogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const user = users.find((u) => u.id === id);

  const searchParams = useSearchParams();
  const dayParam = searchParams.get("day");
  const editDay = dayParam ? Number(dayParam) : null;

  // Look up historical record for edit mode
  const editRecord = editDay
    ? historicalLogs.find((l) => l.day === editDay)?.records[id]
    : null;

  const [puasa, setPuasa] = useState<PuasaOption>(
    editRecord ? puasaStatusToOption(editRecord.puasa) : "Puasa Penuh"
  );
  const [ngaji, setNgaji] = useState(editRecord?.ngaji ?? false);
  const [olahraga, setOlahraga] = useState(editRecord?.olahraga ?? false);
  const [saved, setSaved] = useState(false);

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

  function handleSimpan() {
    setSaved(true);
    setTimeout(() => {
      router.push(editDay ? `/dashboard/${id}` : "/");
    }, 1500);
  }

  return (
    <main className="min-h-screen bg-green-50">
      {/* ── Header ── */}
      <header className="bg-emerald-700 text-white py-5 px-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={() => router.back()}
            aria-label="Kembali ke beranda"
            className="p-2 rounded-xl hover:bg-emerald-600 active:bg-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Moon className="w-6 h-6 text-yellow-300 fill-yellow-300" />
          <div>
            <h1 className="text-lg font-bold leading-tight">
              {editDay ? `Edit Hari ${editDay}` : "Jurnal Harian"}
            </h1>
            <p className="text-emerald-200 text-sm">{user.name} {user.avatar}</p>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">

        {/* ── Puasa Section ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-green-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-emerald-900">Status Puasa</h2>
          </div>

          <div className="flex flex-col gap-2">
            {PUASA_OPTIONS.map((option) => {
              const isSelected = puasa === option;
              return (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-150
                    ${isSelected ? puasaStyles[option] : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"}`}
                >
                  <input
                    type="radio"
                    name="puasa"
                    value={option}
                    checked={isSelected}
                    onChange={() => setPuasa(option)}
                    className="sr-only"
                  />
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                    ${isSelected ? "border-current" : "border-gray-300"}`}
                  >
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-current" />
                    )}
                  </span>
                  <span className="font-medium text-sm">{option}</span>
                </label>
              );
            })}
          </div>
        </section>

        {/* ── Ngaji & Olahraga Toggles ── */}
        <section className="space-y-3">
          <ToggleRow
            label="Ngaji"
            sublabel="Belum membaca Al-Qur'an hari ini"
            icon={<BookOpen className="w-6 h-6" />}
            checked={ngaji}
            onChange={setNgaji}
          />
          <ToggleRow
            label="Olahraga"
            sublabel="Belum berolahraga hari ini"
            icon={<Activity className="w-6 h-6" />}
            checked={olahraga}
            onChange={setOlahraga}
          />
        </section>

        {/* ── Summary Card ── */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-3">
            Ringkasan Hari Ini
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <p className="text-xl mb-1">🌙</p>
              <p className="text-[11px] font-medium text-gray-500">Puasa</p>
              <p className="text-xs font-bold text-emerald-700 mt-0.5 leading-tight">{puasa}</p>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <p className="text-xl mb-1">{ngaji ? "📖" : "📕"}</p>
              <p className="text-[11px] font-medium text-gray-500">Ngaji</p>
              <p className={`text-xs font-bold mt-0.5 ${ngaji ? "text-emerald-700" : "text-gray-400"}`}>
                {ngaji ? "Sudah" : "Belum"}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <p className="text-xl mb-1">{olahraga ? "🏃" : "🛋️"}</p>
              <p className="text-[11px] font-medium text-gray-500">Olahraga</p>
              <p className={`text-xs font-bold mt-0.5 ${olahraga ? "text-emerald-700" : "text-gray-400"}`}>
                {olahraga ? "Sudah" : "Belum"}
              </p>
            </div>
          </div>
        </section>

        {/* ── Save Button / Success State ── */}
        {saved ? (
          <div className="flex items-center justify-center gap-3 bg-emerald-600 text-white rounded-2xl py-4 shadow-lg">
            <CheckCircle2 className="w-6 h-6 fill-white text-emerald-600" />
            <span className="font-bold text-lg">Jurnal Tersimpan!</span>
          </div>
        ) : (
          <button
            onClick={handleSimpan}
            className="w-full flex items-center justify-center gap-2
                       bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800
                       text-white font-bold text-base py-4 rounded-2xl shadow-lg
                       transition-all duration-150 active:scale-95"
          >
            <Save className="w-5 h-5" />
            {editDay ? "Simpan Perubahan" : "Simpan Jurnal"}
          </button>
        )}

        <p className="text-center text-xs text-emerald-400 pb-2">
          Jazakallahu khairan atas ibadahmu hari ini ✨
        </p>
      </div>
    </main>
  );
}
