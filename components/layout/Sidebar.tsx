"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Stethoscope, Dumbbell, Salad,
  Moon, Droplets, History, Lightbulb, FileText, LogOut,
} from "lucide-react";

const navLinks = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, dot: "#38BDF8" },
  { label: "Pemeriksaan", href: "/pemeriksaan", icon: Stethoscope, dot: "#F87171" },
  { label: "Olahraga", href: "/olahraga", icon: Dumbbell, dot: "#FBBF24" },
  { label: "Nutrisi", href: "/nutrisi", icon: Salad, dot: "#4ADE80" },
  { label: "Tidur", href: "/tidur", icon: Moon, dot: "#A78BFA" },
  { label: "Air", href: "/air", icon: Droplets, dot: "#38BDF8" },
];

const bottomLinks = [
  { label: "Riwayat", href: "/riwayat", icon: History },
  { label: "Insight AI", href: "/insight", icon: Lightbulb },
  { label: "Laporan", href: "/laporan", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="sidebar">
      <div className="nav-logo">
        <div className="nav-logo-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2C8 2 2 5.5 2 9.5C2 12 4.5 14 8 14C11.5 14 14 12 14 9.5C14 5.5 8 2 8 2Z" fill="white" fillOpacity="0.9"/>
            <path d="M5 9L7 11L11 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="nav-logo-text">HealthCheck</span>
      </div>

      <div className="nav-user">
        <div className="nav-avatar">A</div>
        <div>
          <p className="nav-user-name">Ahmad</p>
          <p className="nav-user-role">Pengguna Aktif</p>
        </div>
      </div>

      <nav className="nav-links">
        <span className="nav-section-label">Menu</span>
        {navLinks.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={`nav-link${active ? " active" : ""}`}>
              <Icon size={16} strokeWidth={active ? 2.2 : 1.7} />
              {item.label}
              {active && <span className="nav-dot" style={{ background: item.dot, boxShadow: `0 0 6px ${item.dot}60` }} />}
            </Link>
          );
        })}
        <div className="nav-divider" />
        <span className="nav-section-label">Lainnya</span>
        {bottomLinks.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={`nav-link${active ? " active" : ""}`}>
              <Icon size={16} strokeWidth={active ? 2.2 : 1.7} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button className="nav-logout">
        <LogOut size={15} />
        Log out
      </button>
    </aside>
  );
}
