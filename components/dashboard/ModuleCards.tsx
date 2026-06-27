"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Minus, ChevronRight, Stethoscope, Dumbbell, Salad, Moon, Droplets } from "lucide-react";

const modules = [
  { href: "/pemeriksaan", icon: Stethoscope, name: "Pemeriksaan", value: "120/80", unit: "mmHg", change: "Normal", changeType: "up" as const, changeColor: "#34D399", bgClass: "bg-sky-500/10 text-sky-400" },
  { href: "/olahraga", icon: Dumbbell, name: "Olahraga", value: "45", unit: "menit", change: "+15 mnt", changeType: "up" as const, changeColor: "#34D399", bgClass: "bg-amber-500/10 text-amber-400" },
  { href: "/nutrisi", icon: Salad, name: "Nutrisi", value: "1.820", unit: "kkal", change: "-180 kkal", changeType: "down" as const, changeColor: "#FB7185", bgClass: "bg-emerald-500/10 text-emerald-400" },
  { href: "/tidur", icon: Moon, name: "Tidur", value: "7,5", unit: "jam", change: "+30 mnt", changeType: "up" as const, changeColor: "#34D399", bgClass: "bg-indigo-500/10 text-indigo-400" },
  { href: "/air", icon: Droplets, name: "Air", value: "6", unit: "/ 8 gelas", change: "75%", changeType: "mid" as const, changeColor: "#FBBF24", bgClass: "bg-blue-500/10 text-blue-400" },
];

export default function ModuleCards() {
  return (
    <div className="modules-section">
      <div className="modules-header">
        <div>
          <p className="modules-title">Modul Kesehatan</p>
          <p className="modules-sub">Statistik per modul untuk hari ini</p>
        </div>
        <Link href="/riwayat" style={{ fontSize: 13, fontFamily: "var(--font-sans)", fontWeight: 600, color: "#38BDF8", display: "flex", alignItems: "center", gap: 4 }}>
          Lihat semua <ChevronRight size={14} strokeWidth={2.5} />
        </Link>
      </div>
      <div className="modules-grid">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link key={mod.href} href={mod.href} style={{ textDecoration: "none" }}>
              <div className="module-tile">
                <div className={`module-icon-wrap ${mod.bgClass}`}>
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div>
                  <p className="module-name">{mod.name}</p>
                  <p className="module-value">
                    {mod.value}
                    {mod.unit && <span className="module-unit-small"> {mod.unit}</span>}
                  </p>
                </div>
                <p className="module-change" style={{ color: mod.changeColor }}>
                  {mod.changeType === "up" && <ArrowUpRight size={13} strokeWidth={2.5} />}
                  {mod.changeType === "down" && <ArrowDownRight size={13} strokeWidth={2.5} />}
                  {mod.changeType === "mid" && <Minus size={13} strokeWidth={2.5} />}
                  {mod.change}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
