"use client";

import Link from "next/link";

export default function AIStrip() {
  return (
    <div className="ai-card">
      <div className="ai-icon-wrap">✦</div>
      <div style={{ flex: 1 }}>
        <p className="ai-label">Insight AI · Hari ini</p>
        <p className="ai-text">
          Pola tidurmu membaik 3 hari berturut-turut — pertahankan jam tidur sebelum pukul 23.00.
          Aktivitas fisikmu juga naik minggu ini. Coba tambah konsumsi protein untuk pemulihan otot.
        </p>
      </div>
      <Link href="/insight" className="ai-btn">
        Lihat semua
        <span>→</span>
      </Link>
    </div>
  );
}
