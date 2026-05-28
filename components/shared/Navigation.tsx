"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Dumbbell, Utensils, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/workout", icon: Dumbbell, label: "Workout" },
  { href: "/nutrition", icon: Utensils, label: "Nutrition" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#1a1a2e",
        borderTop: "1px solid #2d2d4e",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "8px 0 max(8px, env(safe-area-inset-bottom))",
        zIndex: 100,
      }}
    >
      {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              color: active ? "#e94560" : "#9ca3af",
              textDecoration: "none",
              fontSize: 10,
              fontWeight: active ? 600 : 400,
              minWidth: 64,
            }}
          >
            <Icon size={22} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
