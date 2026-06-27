"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Mail, Bell, Menu, X } from "lucide-react";

const tabs = [
  { label: "Dashboard", href: "/" },
  { label: "Pemeriksaan", href: "/pemeriksaan" },
  { label: "Olahraga", href: "/olahraga" },
  { label: "Nutrisi", href: "/nutrisi" },
  { label: "Tidur", href: "/tidur" },
];

export default function Topbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Logo */}
        <Link href="/" className="topbar-brand">
          <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shield outline */}
            <path d="M32 6C32 6 14 14 14 14V32C14 46 32 58 32 58C32 58 50 46 50 32V14L32 6Z" stroke="#3AAFA9" strokeWidth="4" strokeLinejoin="round" fill="none" />
            {/* Checkmark */}
            <path d="M22 32L29 39L42 24" stroke="#3AAFA9" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span className="topbar-brand-text">HealthCheck</span>
        </Link>

        {/* Nav Tabs - Desktop */}
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

        {/* Hamburger - Mobile Only */}
        <button
          className="topbar-hamburger"
          aria-label="Menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} color="#1A1D23" /> : <Menu size={20} color="#1A1D23" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <nav className="mobile-drawer">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`mobile-drawer-link${isActive(tab.href) ? " active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              {tab.label}
            </Link>
          ))}
          <div className="mobile-drawer-search">
            <Search size={14} color="#9CA3AF" />
            <input type="text" placeholder="Cari..." />
          </div>
        </nav>
      )}
    </header>
  );
}
