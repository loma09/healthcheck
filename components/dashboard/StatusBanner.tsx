"use client";

import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function StatusBanner() {
  return (
    <div className="status-banner">
      <div className="status-banner-left">
        <div className="status-icon">
          <ShieldCheck size={24} color="#38BDF8" strokeWidth={2} />
        </div>
        <div>
          <p className="status-label">Kondisi Hari Ini</p>
          <p className="status-value">Baik ✓</p>
        </div>
      </div>
      <div className="status-badge">
        <CheckCircle2 size={14} strokeWidth={2.5} />
        Semua indikator normal
      </div>
    </div>
  );
}
