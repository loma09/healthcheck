"use client";

import { Heart, Activity, ArrowUpRight, Minus } from "lucide-react";

const vitals = [
  {
    label: "Detak Jantung",
    icon: Heart,
    iconColor: "#FB7185",
    iconBg: "bg-rose-500/10",
    value: "65",
    unit: "BPM",
    badge: "Normal",
    badgeClass: "normal",
    trend: "Stabil",
    trendClass: "stable",
    sparkColor: "#FB7185",
  },
  {
    label: "Tekanan Darah",
    icon: Activity,
    iconColor: "#34D399",
    iconBg: "bg-emerald-500/10",
    value: "120/80",
    unit: "mmHg",
    badge: "Normal",
    badgeClass: "normal",
    trend: "Stabil dari kemarin",
    trendClass: "stable",
    sparkColor: "#34D399",
  },
];

export default function VitalSigns() {
  return (
    <div className="vitals-grid">
      {vitals.map((v) => {
        const Icon = v.icon;
        return (
          <div key={v.label} className="vital-card">
            <div className="vital-header">
              <span className="vital-label">
                <div className={`vital-icon-wrap ${v.iconBg}`}>
                  <Icon size={16} color={v.iconColor} strokeWidth={2.5} />
                </div>
                {v.label}
              </span>
              <span className={`vital-badge ${v.badgeClass}`}>{v.badge}</span>
            </div>
            <p className="vital-value">
              {v.value}
              <span className="vital-unit">{v.unit}</span>
            </p>
            <div className={`vital-trend ${v.trendClass}`}>
              {v.trendClass === "up" && <ArrowUpRight size={14} strokeWidth={2.5} />}
              {v.trendClass === "stable" && <Minus size={14} strokeWidth={2.5} />}
              {v.trend}
            </div>
            {/* Sparkline decoration */}
            <svg className="vital-sparkline" viewBox="0 0 120 40" preserveAspectRatio="none">
              <path
                d={v.label === "Detak Jantung"
                  ? "M0,30 L10,28 L15,10 L20,35 L25,20 L30,25 L40,28 L50,26 L55,8 L60,32 L65,22 L70,25 L80,28 L90,26 L95,12 L100,30 L110,28 L120,30"
                  : "M0,25 Q30,20 60,22 T120,20"
                }
                stroke={v.sparkColor}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
