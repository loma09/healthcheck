"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { ChevronRight } from "lucide-react";

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
        background: "rgba(18, 24, 27, 0.95)", color: "white",
        padding: "10px 14px", borderRadius: 10, fontSize: 12,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}>
        <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 2, fontSize: 11 }}>{label}</p>
        <p style={{ fontWeight: 800, fontSize: 20 }}>
          {payload[0].value}
          <span style={{ fontWeight: 400, opacity: 0.4, fontSize: 12, marginLeft: 3 }}>/100</span>
        </p>
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
        <button className="chart-pill">
          01–07 Jun <ChevronRight size={12} style={{ marginLeft: 4 }} />
        </button>
      </div>

      <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1.5px", color: "var(--color-text)", lineHeight: 1, marginBottom: 20 }}>
        82 <span style={{ fontSize: 14, color: "var(--color-text-3)", fontWeight: 500, marginLeft: 6 }}>skor tertinggi minggu ini</span>
      </div>

      <ResponsiveContainer width="100%" height={170}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="hari" tick={{ fontSize: 11.5, fill: "rgba(226,232,240,0.3)" }} axisLine={false} tickLine={false} />
          <YAxis domain={[60, 100]} tick={{ fontSize: 11.5, fill: "rgba(226,232,240,0.3)" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#38BDF8", strokeWidth: 1, strokeDasharray: "4 4" }} />
          <Area
            type="monotone" dataKey="skor"
            stroke="#38BDF8" strokeWidth={2.5}
            fill="url(#scoreGrad)" dot={false}
            activeDot={{ r: 5, fill: "#38BDF8", strokeWidth: 2, stroke: "#1E262B" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
