"use client";

import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";

export default function AIStrip() {
  return (
    <div className="ai-card">
      <div className="ai-icon-wrap">
        <Sparkles size={18} color="#fff" strokeWidth={2} />
      </div>
      <div style={{ flex: 1 }}>
        <p className="ai-label">Insight AI · Hari ini</p>
        <p className="ai-text">
          Pola tidurmu membaik 3 hari berturut-turut — pertahankan jam tidur sebelum pukul 23.00.
          Aktivitas fisikmu juga naik minggu ini. Coba tambah konsumsi protein untuk pemulihan otot.
        </p>
      </div>
      <Link href="/insight" className="ai-btn">
        Lihat semua <ChevronRight size={14} strokeWidth={2.5} />
      </Link>
    </div>
  );
}
