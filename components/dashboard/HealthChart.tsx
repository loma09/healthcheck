"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { hari: "Sen", skor: 72 },
  { hari: "Sel", skor: 75 },
  { hari: "Rab", skor: 70 },
  { hari: "Kam", skor: 80 },
  { hari: "Jum", skor: 83 },
  { hari: "Sab", skor: 79 },
  { hari: "Min", skor: 82 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: "#1C1917",
        color: "white",
        padding: "8px 12px",
        borderRadius: 8,
        fontSize: 12,
        fontFamily: "Plus Jakarta Sans",
      }}>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>{label}</p>
        <p style={{ fontWeight: 700 }}>{payload[0].value} <span style={{ fontWeight: 400, opacity: 0.6 }}>/100</span></p>
      </div>
    );
  }
  return null;
};

export default function HealthChart() {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <p className="chart-title">Aktivitas Kesehatan</p>
          <p className="chart-subtitle">Skor harian — 7 hari terakhir</p>
        </div>
        <span className="chart-pill">01–07 Jun ↓</span>
      </div>

      {/* Peak callout */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 20 }}>
        <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-1px", color: "var(--color-text)" }}>
          82
        </span>
        <span style={{ fontSize: 14, color: "var(--color-text-3)", fontWeight: 500 }}>
          skor tertinggi minggu ini
        </span>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#E8614A" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#E8614A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE5" vertical={false} />
          <XAxis
            dataKey="hari"
            tick={{ fontSize: 11.5, fill: "#A8A29E", fontFamily: "Plus Jakarta Sans" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            domain={[60, 100]}
            tick={{ fontSize: 11.5, fill: "#A8A29E", fontFamily: "Plus Jakarta Sans" }}
            axisLine={false} tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#E8614A", strokeWidth: 1, strokeDasharray: "4 4" }} />
          <Area
            type="monotone"
            dataKey="skor"
            stroke="#E8614A"
            strokeWidth={2.5}
            fill="url(#scoreGrad)"
            dot={false}
            activeDot={{ r: 5, fill: "#E8614A", strokeWidth: 2, stroke: "white" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
