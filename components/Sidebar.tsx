"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BotMessageSquare,
  LayoutDashboard,
  Settings,
  Info,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname(); // 🔥 เอาไว้เช็คหน้าปัจจุบัน

  return (
    <div
      className="w-64 h-screen flex flex-col justify-between p-5 
      bg-[var(--background)] text-[var(--foreground)]
      border-r border-gray-200/50 dark:border-gray-700 transition-colors"
    >
      {/* Top */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white text-lg">
            🚤
          </div>
          <div>
            <h1 className="font-semibold">Smart Boat</h1>
            <p className="text-xs text-gray-400">Control System</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="space-y-2">
          <SidebarItem
            icon={<Home size={18} />}
            label="Home"
            href="/"
            active={pathname === "/"}
          />

          <SidebarItem
            icon={<BotMessageSquare size={18} />}
            label="AI Assistant"
            href="/assistant"
            active={pathname === "/assistant"}
          />

          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            href="/dashboard"
            active={pathname === "/dashboard"}
          />

          <SidebarItem
            icon={<Settings size={18} />}
            label="Settings"
            href="/settings"
            active={pathname === "/settings"}
          />

          <SidebarItem
            icon={<Info size={18} />}
            label="About Us"
            href="/about"
            active={pathname === "/about"}
          />
        </nav>
      </div>

      {/* Bottom */}
      <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center">
        N
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  href,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link href={href}>
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm
          transition-all
          ${
            active
              ? "bg-teal-500 text-white shadow-md"
              : "text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }
        `}
      >
        {icon}
        <span className="font-medium">{label}</span>
      </div>
    </Link>
  );
}