"use client";

import { Bell, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../supabase"; // ดึงตัวแปร supabase จาก Root
import Link from "next/link"; // สำหรับทำลิงก์ไปยังหน้า Setting

export default function Header() {
  const [dark, setDark] = useState(false);
  const [displayName, setDisplayName] = useState("Loading...");

  // 1. จัดการเรื่อง Theme (ดึงค่าและบันทึกลง localStorage)
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // 2. ดึงข้อมูลโปรไฟล์จากฐานข้อมูล Supabase
  useEffect(() => {
    async function getProfile() {
      try {
        // ดึงข้อมูลแถวเดียวจากตาราง profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .single();

        if (data) {
          setDisplayName(data.full_name);
        } else if (error) {
          console.error("Supabase error:", error.message);
          setDisplayName("Woraprat"); // ค่าเริ่มต้นกรณีโหลดไม่สำเร็จ
        }
      } catch (err) {
        setDisplayName("Woraprat");
      }
    }

    getProfile();
  }, []);

  return (
    <div className="flex justify-between items-center bg-white dark:bg-[#1a2233] p-6 rounded-2xl shadow-md border border-slate-200 dark:border-white/5 transition-all">
      {/* ส่วนซ้าย: ข้อความทักทาย */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white transition-colors">
          Hi, {displayName} 👋
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Welcome back to your boat control system
        </p>
      </div>

      {/* ส่วนขวา: ปุ่มสลับธีม, แจ้งเตือน และลิงก์โปรไฟล์ */}
      <div className="flex items-center gap-4">
        
        {/* 🌙 ปุ่มสลับธีม */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:scale-105 transition border border-slate-200 dark:border-white/5"
        >
          {dark ? <Sun className="text-yellow-400" /> : <Moon className="text-slate-500" />}
        </button>

        {/* 🔔 แจ้งเตือน */}
        <Bell className="text-slate-500 dark:text-slate-400 cursor-pointer hover:text-teal-500 transition-colors" />

        {/* 👤 โปรไฟล์ (กดแล้วไปหน้า Setting/Profile) */}
        <Link 
          href="/settings/profile" 
          className="flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-white/5 p-2 rounded-xl transition-all group"
        >
          <div className="text-right">
            <p className="font-medium text-slate-900 dark:text-white transition-colors group-hover:text-teal-500">
              {displayName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Admin</p>
          </div>
          <div className="w-10 h-10 bg-teal-500 text-white flex items-center justify-center rounded-full font-bold shadow-sm group-hover:ring-2 group-hover:ring-teal-500/50 transition-all">
            {displayName !== "Loading..." ? displayName.charAt(0).toUpperCase() : "W"}
          </div>
        </Link>
      </div>
    </div>
  );
}