"use client";

import { useState } from "react";
import { Pill, Check, Clock } from "lucide-react";

const medications = [
  { id: 1, name: "Amlodipin", dose: "5mg — 1 tablet", time: "07:00", done: true },
  { id: 2, name: "Metformin", dose: "500mg — 1 tablet", time: "12:00", done: false },
  { id: 3, name: "Vitamin D3", dose: "1000 IU — 1 kapsul", time: "19:00", done: false },
];

export default function MedsReminder() {
  const [meds, setMeds] = useState(medications);

  const toggleMed = (id: number) => {
    setMeds((prev) =>
      prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m))
    );
  };

  return (
    <div className="meds-card">
      <div className="meds-header">
        <div className="bg-sky-500/10 text-sky-400 p-2 rounded-xl">
          <Pill size={18} strokeWidth={2} />
        </div>
        <span className="meds-title">Pengingat Obat</span>
        <span style={{ marginLeft: "auto", fontSize: 13, color: "#64748B", fontWeight: 500 }}>
          {meds.filter((m) => m.done).length} dari {meds.length} selesai
        </span>
      </div>
      <div className="meds-list">
        {meds.map((med) => (
          <div key={med.id} className="med-item">
            <button
              className={`med-check ${med.done ? "done" : ""}`}
              onClick={() => toggleMed(med.id)}
              aria-label={`Tandai ${med.name} selesai`}
            >
              {med.done && <Check size={18} color="#10B981" strokeWidth={3} />}
            </button>
            <div>
              <p className="med-name" style={{ opacity: med.done ? 0.5 : 1, textDecoration: med.done ? "line-through" : "none" }}>
                {med.name}
              </p>
              <p className="med-dose" style={{ opacity: med.done ? 0.5 : 1 }}>{med.dose}</p>
            </div>
            <span className="med-time" style={{ opacity: med.done ? 0.5 : 1 }}>
              <Clock size={13} strokeWidth={2.5} style={{ marginRight: 6 }} />
              {med.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
