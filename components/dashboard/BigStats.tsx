"use client";

const stats = [
  {
    label: "Skor Kesehatan",
    dot: "#E8614A",
    value: "82",
    unit: "/100",
    trend: "↑ 5 dari kemarin",
  },
  {
    label: "Hari Aktif Bulan Ini",
    dot: "#4A7C59",
    value: "19",
    unit: "hari",
    trend: "↑ 3 minggu berturut",
  },
  {
    label: "Rata-rata Tidur",
    dot: "#4C5FA8",
    value: "7,4",
    unit: "jam",
    trend: "↑ 0,5 jam",
  },
];

export default function BigStats() {
  return (
    <div className="stats-row">
      {stats.map((s) => (
        <div key={s.label} className="stat-block">
          <span className="stat-label">
            <span className="stat-dot" style={{ background: s.dot }} />
            {s.label}
          </span>
          <p className="stat-value">
            {s.value}
            <span className="stat-unit">{s.unit}</span>
          </p>
          <span className="stat-trend">{s.trend}</span>
        </div>
      ))}
    </div>
  );
}
