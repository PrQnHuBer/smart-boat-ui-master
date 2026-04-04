"use client";

import { Bell, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [dark, setDark] = useState(false);

  // โหลดค่า theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // toggle theme
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div
      className="
        flex justify-between items-center
        bg-card
        text-foreground
        p-6 rounded-2xl shadow-md
        border border-default
        transition-all
      "
    >
      {/* Left */}
      <div>
        <h1 className="text-xl font-semibold">
          Hi, Woraprat 👋
        </h1>
        <p className="text-sm text-muted">
          Welcome back to your boat control system
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* 🌙 Toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="
            p-2 rounded-lg
            bg-background
            hover:scale-105
            transition
            border border-default
          "
        >
          {dark ? (
            <Sun className="text-yellow-400" />
          ) : (
            <Moon className="text-muted" />
          )}
        </button>

        {/* Bell */}
        <Bell className="text-muted cursor-pointer" />

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-medium">
              Woraprat
            </p>
            <p className="text-xs text-muted">Admin</p>
          </div>

          <div className="w-10 h-10 bg-teal-500 text-white flex items-center justify-center rounded-full">
            W
          </div>
        </div>
      </div>
    </div>
  );
}