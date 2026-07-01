"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Mail, Bell, Menu, X, LogOut, UserCog } from "lucide-react";
import { signOut } from "@/lib/supabase";
import { useUser } from "@/lib/user-context";

const tabs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Pemeriksaan", href: "/dashboard/pemeriksaan" },
  { label: "Olahraga", href: "/dashboard/olahraga" },
  { label: "Nutrisi", href: "/dashboard/nutrisi" },
  { label: "Tidur", href: "/dashboard/tidur" },
];

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const avatar = profile?.avatar_url ?? null;
  const initials = profile?.name
    ? profile.name.trim().split(/\s+/).map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email
    ? profile.email[0].toUpperCase()
    : 'U';

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <Link href="/dashboard" className="topbar-brand">
          <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 6C32 6 14 14 14 14V32C14 46 32 58 32 58C32 58 50 46 50 32V14L32 6Z" stroke="#3AAFA9" strokeWidth="4" strokeLinejoin="round" fill="none" />
            <path d="M22 32L29 39L42 24" stroke="#3AAFA9" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span className="topbar-brand-text">HealthCheck</span>
        </Link>

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

        {/* Avatar + Dropdown */}
        <div className="topbar-avatar-wrapper">
          <div className="topbar-avatar" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {avatar
              ? <img src={avatar} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{initials}</span>
            }
          </div>

          {dropdownOpen && (
            <>
              <div
                className="avatar-overlay"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="avatar-dropdown">
                <Link
                  href="/profile"
                  className="avatar-dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <UserCog size={14} /> Edit Profil
                </Link>
                <button
                  className="avatar-dropdown-item danger"
                  onClick={handleLogout}
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </>
          )}
        </div>

        <button
          className="topbar-hamburger"
          aria-label="Menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} color="#1A1D23" /> : <Menu size={20} color="#1A1D23" />}
        </button>
      </div>

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
          <div className="mobile-drawer-actions">
            <Link href="/profile" className="mobile-drawer-link" onClick={() => setMobileOpen(false)}>
              <UserCog size={14} /> Edit Profil
            </Link>
            <button className="mobile-drawer-link danger" onClick={handleLogout}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}