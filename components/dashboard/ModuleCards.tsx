"use client";

import Link from "next/link";

const modules = [
  {
    href: "/pemeriksaan",
    emoji: "🩺",
    name: "Pemeriksaan",
    value: "120/80",
    unit: "mmHg",
    change: "Normal",
    changePct: "",
    bgIcon: "bg-coral-light",
    changeColor: "var(--color-sage)",
  },
  {
    href: "/olahraga",
    emoji: "🏃",
    name: "Olahraga",
    value: "45",
    unit: "menit",
    change: "+15 mnt",
    changePct: "",
    bgIcon: "bg-amber-light",
    changeColor: "var(--color-sage)",
  },
  {
    href: "/nutrisi",
    emoji: "🥗",
    name: "Nutrisi",
    value: "1.820",
    unit: "kkal",
    change: "-180 kkal",
    changePct: "",
    bgIcon: "bg-sage-light",
    changeColor: "var(--color-coral)",
  },
  {
    href: "/tidur",
    emoji: "🌙",
    name: "Tidur",
    value: "7j 30m",
    unit: "",
    change: "+30 mnt",
    changePct: "",
    bgIcon: "bg-indigo-light",
    changeColor: "var(--color-sage)",
  },
  {
    href: "/air",
    emoji: "💧",
    name: "Air",
    value: "6",
    unit: "/ 8 gelas",
    change: "75%",
    changePct: "",
    bgIcon: "bg-sky-light",
    changeColor: "var(--color-amber)",
  },
];

export default function ModuleCards() {
  return (
    <div className="modules-section">
      <div className="modules-header">
        <div>
          <p className="modules-title">Modul Kesehatan</p>
          <p className="modules-sub">Statistik per modul untuk 1 hari ini</p>
        </div>
        <Link
          href="/riwayat"
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: "var(--color-text-2)",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          Lihat semua →
        </Link>
      </div>

      <div className="modules-grid">
        {modules.map((mod) => (
          <Link key={mod.href} href={mod.href} style={{ textDecoration: "none" }}>
            <div className="module-tile">
              <div className={`module-icon-wrap ${mod.bgIcon}`}>
                {mod.emoji}
              </div>
              <div>
                <p className="module-name">{mod.name}</p>
                <p className="module-value">
                  {mod.value}
                  {mod.unit && (
                    <span className="module-unit-small"> {mod.unit}</span>
                  )}
                </p>
              </div>
              <p
                className="module-change"
                style={{ color: mod.changeColor }}
              >
                {mod.change}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
