"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Mail, Bell } from "lucide-react";

const tabs = [
  { label: "Dashboard", href: "/" },
  { label: "Pemeriksaan", href: "/pemeriksaan" },
  { label: "Olahraga", href: "/olahraga" },
  { label: "Nutrisi", href: "/nutrisi" },
  { label: "Tidur", href: "/tidur" },
];

export default function Topbar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Logo */}
        <div className="topbar-logo">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L9.5 5.5L14 4L10.5 8L14 12L9.5 10.5L8 15L6.5 10.5L2 12L5.5 8L2 4L6.5 5.5L8 1Z" fill="white" fillOpacity="0.9" />
          </svg>
        </div>

        {/* Nav Tabs */}
        <nav className="topbar-tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`topbar-tab${isActive(tab.href) ? " active" : ""}`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="topbar-right">
        <div className="topbar-search">
          <Search size={14} color="#9CA3AF" />
          <input type="text" placeholder="Search .." />
        </div>
        <button className="topbar-btn" aria-label="Mail">
          <Mail size={16} color="#6B7280" strokeWidth={1.8} />
        </button>
        <button className="topbar-btn" aria-label="Notifications">
          <Bell size={16} color="#6B7280" strokeWidth={1.8} />
          <span className="notif-dot" />
        </button>
        <div className="topbar-avatar">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/profile.png" alt="User" />
        </div>
      </div>
    </header>
  );
}
