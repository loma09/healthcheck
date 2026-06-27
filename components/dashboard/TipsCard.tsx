"use client";

import { Droplets, Moon, Salad } from "lucide-react";

const tips = [
  { icon: Droplets, text: "Minum 2 gelas air sebelum makan membantu kontrol porsi makan siang.", color: "#38BDF8", bgClass: "bg-sky-500/10 text-sky-400" },
  { icon: Moon, text: "Konsistensi jam tidur lebih penting dari durasi — usahakan tidur pukul 22.30.", color: "#A78BFA", bgClass: "bg-indigo-500/10 text-indigo-400" },
  { icon: Salad, text: "Tambah satu porsi sayur hijau hari ini untuk capai target mikronutrien.", color: "#34D399", bgClass: "bg-emerald-500/10 text-emerald-400" },
];

export default function TipsCard() {
  return (
    <div className="tips-card">
      <p className="tips-title">
        <span style={{ fontSize: 18, marginRight: 4 }}>💡</span> Tips Hari Ini
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 4 }}>
        {tips.map((tip, i) => {
          const Icon = tip.icon;
          return (
            <div key={i} className="tip-item">
              <div className={`tip-icon-wrap ${tip.bgClass}`}>
                <Icon size={16} strokeWidth={2.5} />
              </div>
              <p className="tip-text">{tip.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
