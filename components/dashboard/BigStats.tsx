"use client";

import { ArrowUpRight } from "lucide-react";

const stats = [
  { label: "Skor Kesehatan", dot: "#38BDF8", value: "82", unit: "/100", trend: "+5 dari kemarin" },
  { label: "Hari Aktif Bulan Ini", dot: "#4ADE80", value: "19", unit: "hari", trend: "+3 minggu berturut" },
  { label: "Rata-rata Tidur", dot: "#A78BFA", value: "7,4", unit: "jam", trend: "+0,5 jam" },
];

export default function BigStats() {
  return (
    <div className="stats-row">
      {stats.map((s) => (
        <div key={s.label} className="stat-block">
          <span className="stat-label">
            <span className="stat-dot" style={{ background: s.dot, boxShadow: `0 0 6px ${s.dot}50` }} />
            {s.label}
          </span>
          <p className="stat-value">
            {s.value}<span className="stat-unit">{s.unit}</span>
          </p>
          <span className="stat-trend">
            <ArrowUpRight size={13} strokeWidth={2.5} />
            {s.trend}
          </span>
        </div>
      ))}
    </div>
  );
}
