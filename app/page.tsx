"use client";

import React, { useState, useEffect, useRef } from "react";
import Card from "@/components/Card";
import { Cpu, Gamepad2, Calendar, Clock, Activity, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import Header from "@/components/Header";

export default function HomePage() {
  const router = useRouter();
  const [isAuto, setIsAuto] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 1. ระบบตรวจสอบสิทธิ์แบบเข้มงวด
  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (!session) {
      // ถ้าไม่มีข้อมูลการ Login ให้เด้งไปหน้า Login ทันที
      router.replace("/login"); 
    } else {
      // ถ้ามีข้อมูลแล้วถึงจะยอมให้แสดงเนื้อหา
      setIsAuthLoading(false);
    }
  }, [router]);

  // 2. จัดการเรื่องเวลาและวันที่
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
      setCurrentDate(now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    };
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // ระหว่างที่เช็คสิทธิ์ (isAuthLoading) จะไม่แสดงเนื้อหา Dashboard เด็ดขาด
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] p-6 transition-colors duration-500 font-sans">

      {/* --- SYSTEM STATUS --- */}
      <div className="mt-8 grid grid-cols-1 gap-6 mb-6">
        <Card className="p-6 bg-white dark:bg-[#1a2233] border-slate-200 dark:border-white/5 transition-colors">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">System Status</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Real-time monitoring</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span className="text-[10px] text-teal-500 font-black uppercase tracking-widest">Running</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 dark:bg-[#1e293b]/50 p-5 rounded-2xl flex items-center gap-4 border border-slate-200 dark:border-transparent transition-colors">
              <div className="p-3 bg-blue-500/20 text-blue-500 dark:text-blue-400 rounded-xl"><Calendar size={20}/></div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Date</p>
                <p className="text-base font-bold text-slate-900 dark:text-white">{currentDate || "Loading..."}</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#1e293b]/50 p-5 rounded-2xl flex items-center gap-4 border border-slate-200 dark:border-transparent transition-colors">
              <div className="p-3 bg-purple-500/20 text-purple-500 dark:text-purple-400 rounded-xl"><Clock size={20}/></div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Time</p>
                <p className="text-base font-bold text-slate-900 dark:text-white">{currentTime || "--:-- --"}</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#1e293b]/50 p-5 rounded-2xl flex items-center gap-4 border border-slate-200 dark:border-transparent transition-colors">
              <div className="p-3 bg-teal-500/20 text-teal-500 dark:text-teal-400 rounded-xl"><Activity size={20}/></div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Status</p>
                <p className={`text-base font-bold ${isAuto ? "text-teal-500" : "text-purple-500"}`}>
                  {isAuto ? "Auto Mode" : "Manual Mode"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* --- MODE SELECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <button onClick={() => setIsAuto(!isAuto)} className="text-left active:scale-[0.98] transition-all">
          <Card className={`p-12 flex flex-col items-center justify-center border-2 transition-all duration-500 rounded-[2.5rem] ${isAuto ? "bg-teal-500/10 border-teal-500 shadow-xl" : "bg-white dark:bg-[#1a2233] border-slate-200 dark:border-white/5 hover:border-teal-500/50"}`}>
            <div className={`p-5 rounded-2xl mb-4 transition-all duration-500 ${isAuto ? "bg-teal-500 text-white shadow-lg" : "bg-teal-500/10 text-teal-500"}`}>
              <Cpu size={40} />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-[0.2em] mb-1">Mode</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Auto</h3>
          </Card>
        </button>

        <Link href="/manual" className="block active:scale-[0.98] transition-all">
          <Card className="p-12 h-full flex flex-col items-center justify-center border-2 bg-white dark:bg-[#1a2233] border-slate-200 dark:border-white/5 hover:border-purple-500/50 transition-all duration-300 rounded-[2.5rem] group">
            <div className="p-5 rounded-2xl mb-4 bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
              <Gamepad2 size={40} />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-[0.2em] mb-1">Mode</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Manual</h3>
          </Card>
        </Link>
      </div>

      {/* --- AI ASSISTANT --- */}
      <Link href="/assistant" className="block active:scale-[0.99] transition-all group">
        <Card className="p-6 bg-white dark:bg-[#1a2233] border-slate-200 dark:border-white/5 rounded-[2.5rem] transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
               <Activity size={16} className="text-teal-500"/>
               <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">AI Assistant</span>
               <span className="bg-green-500/20 text-green-500 text-[9px] px-2 py-0.5 rounded-full font-bold">ONLINE</span>
            </div>
            <MessageSquare size={18} className="text-slate-400" />
          </div>
          <div className="bg-slate-100 dark:bg-[#0f172a] p-5 rounded-2xl flex gap-4 items-start border border-slate-200 dark:border-white/5 shadow-inner">
             <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm text-white shadow-lg">AI</div>
             <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-1 flex-1">
               "Hello! I'm your AI assistant. Click here to chat with me or get advanced system analytics."
             </p>
          </div>
        </Card>
      </Link>
    </div>
  );
}