"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Dumbbell, Utensils, Settings, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "@/lib/context/ThemeContext";

const NAV_ITEMS = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/workout", icon: Dumbbell, label: "Workout" },
  { href: "/nutrition", icon: Utensils, label: "Nutrition" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  const isDark = theme === "dark";

  const navLink = (href: string, icon: React.ElementType, label: string) => {
    const Icon = icon;
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setOpen(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 16px",
          borderRadius: 10,
          textDecoration: "none",
          color: active ? "#e94560" : "var(--text-muted)",
          backgroundColor: active ? "rgba(233,69,96,0.10)" : "transparent",
          fontWeight: active ? 600 : 400,
          fontSize: 14,
          transition: "background-color 0.15s, color 0.15s",
          margin: "2px 0",
        }}
      >
        <Icon size={18} />
        {label}
      </Link>
    );
  };

  const sidebarContent = (
    <>
      {/* Brand */}
      <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#e94560", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
          <Image src="/app-icon.png" alt="Workout Buddy" width={36} height={36} style={{ filter: "brightness(0) invert(1)", objectFit: "cover" }} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: "var(--text)", lineHeight: 1.2 }}>Workout Buddy</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Ulvi · Hybrid Athlete</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 12px", overflowY: "auto" }}>
        {NAV_ITEMS.map(({ href, icon, label }) => navLink(href, icon, label))}
      </nav>

      {/* Theme toggle */}
      <div style={{ padding: "16px", borderTop: "1px solid var(--border)" }}>
        <button
          onClick={toggle}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            backgroundColor: "var(--surface-light)",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500,
            transition: "background-color 0.15s",
          }}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          {isDark ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)", padding: 4 }}>
          <Menu size={22} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "#e94560", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <Image src="/app-icon.png" alt="icon" width={28} height={28} style={{ filter: "brightness(0) invert(1)" }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>Workout Buddy</span>
        </div>
        <button onClick={toggle} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4, marginLeft: "auto" }}>
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Overlay */}
      <div className={`sidebar-overlay${open ? " open" : ""}`} onClick={() => setOpen(false)} />

      {/* Sidebar panel */}
      <aside className={`sidebar${open ? " open" : ""}`}>
        {/* Mobile close button */}
        <button
          onClick={() => setOpen(false)}
          style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "none" }}
          className="sidebar-close"
        >
          <X size={20} />
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}
