"use client";

import { Settings, Bell } from "lucide-react";

export default function Topbar() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "16px 36px",
        gap: 10,
        borderBottom: "1px solid var(--color-border)",
        background: "var(--color-surface)",
      }}
    >
      <button
        style={{
          width: 36, height: 36,
          borderRadius: "50%",
          background: "var(--color-surface-warm)",
          border: "1px solid var(--color-border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          transition: "background 0.15s",
          position: "relative",
        }}
      >
        <Bell size={15} color="var(--color-text-2)" />
        <span style={{
          position: "absolute", top: 7, right: 7,
          width: 6, height: 6, borderRadius: "50%",
          background: "var(--color-coral)",
          border: "1.5px solid white",
        }} />
      </button>

      <button
        style={{
          width: 36, height: 36,
          borderRadius: "50%",
          background: "var(--color-surface-warm)",
          border: "1px solid var(--color-border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <Settings size={15} color="var(--color-text-2)" />
      </button>
    </header>
  );
}
