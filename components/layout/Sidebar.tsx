"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

const navLinks = [
  { label: "Dashboard", href: "/", dot: "#E8614A" },
  { label: "Pemeriksaan", href: "/pemeriksaan", dot: "#E8614A" },
  { label: "Olahraga", href: "/olahraga", dot: "#D97706" },
  { label: "Nutrisi", href: "/nutrisi", dot: "#4A7C59" },
  { label: "Tidur", href: "/tidur", dot: "#4C5FA8" },
  { label: "Air", href: "/air", dot: "#2E7D9E" },
];

const bottomLinks = [
  { label: "Riwayat", href: "/riwayat" },
  { label: "Insight AI", href: "/insight" },
  { label: "Laporan", href: "/laporan" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="nav-logo">
        <div className="nav-logo-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2C8 2 2 5.5 2 9.5C2 12 4.5 14 8 14C11.5 14 14 12 14 9.5C14 5.5 8 2 8 2Z" fill="white" fillOpacity="0.9"/>
            <path d="M5 9L7 11L11 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="nav-logo-text">HealthCheck</span>
      </div>

      {/* User */}
      <div className="nav-user">
        <div className="nav-avatar">A</div>
        <div style={{ textAlign: "center" }}>
          <p className="nav-user-name">Ahmad</p>
          <p className="nav-user-role">Pengguna Aktif</p>
        </div>
      </div>

      {/* Main nav */}
      <nav className="nav-links">
        {navLinks.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link${active ? " active" : ""}`}
            >
              {item.label}
              {active && (
                <span className="nav-dot" style={{ background: item.dot }} />
              )}
            </Link>
          );
        })}

        <div
          style={{
            height: 1,
            background: "var(--color-border)",
            margin: "12px 0",
          }}
        />

        {bottomLinks.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link${active ? " active" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button className="nav-logout">
        <LogOut size={14} />
        Log out
      </button>
    </aside>
  );
}
