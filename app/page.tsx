"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Link from "next/link";
import { 
  Calendar, Clock, Activity, Cpu, Gamepad2, 
  Compass, Play, Square, Send, MessageSquare 
} from "lucide-react";

export default function Home() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }));
      setDate(now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 p-4 max-w-[1600px] mx-auto">
      
      {/* 1. TOP SECTION: Status & Control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 border border-default bg-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">System Status</h2>
              <p className="text-muted text-sm">Real-time monitoring</p>
            </div>
            <span className="px-3 py-1 bg-muted/20 text-muted rounded-full text-xs flex items-center gap-2">
              <span className="w-2 h-2 bg-muted rounded-full"></span> Stopped
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-4 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <div className="p-3 bg-blue-500 rounded-xl text-white"><Calendar size={20} /></div>
              <div>
                <p className="text-muted text-xs">Date</p>
                <p className="text-foreground font-bold">{date}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-4 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <div className="p-3 bg-purple-500 rounded-xl text-white"><Clock size={20} /></div>
              <div>
                <p className="text-muted text-xs">Time</p>
                <p className="text-foreground font-bold">{time}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center gap-4 shadow-[0_0_15px_rgba(20,184,166,0.1)]">
              <div className="p-3 bg-teal-500 rounded-xl text-white"><Activity size={20} /></div>
              <div>
                <p className="text-muted text-xs">Status</p>
                <p className="text-teal-500 font-bold">Optimal</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-default bg-card">
          <h2 className="text-xl font-bold text-foreground mb-6">Control Panel</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold transition-all shadow-[0_4px_20px_rgba(34,197,94,0.4)]">
              <Play size={20} fill="currentColor" /> Start System
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold transition-all shadow-[0_4px_20px_rgba(239,68,68,0.4)]">
              <Square size={20} fill="currentColor" /> Stop System
            </button>
          </div>
        </Card>
      </div>

      {/* 2. CENTER SECTION: Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-10 border-2 border-teal-500/50 bg-teal-500/5 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(20,184,166,0.1)]">
          <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-[0_0_20px_rgba(20,184,166,0.5)]">
            <Cpu size={32} />
          </div>
          <p className="text-muted text-sm">Mode</p>
          <h3 className="text-xl font-bold text-foreground">Auto</h3>
          <span className="text-teal-500 text-sm mt-1">● Active</span>
        </Card>

        <Link href="/manual" className="block group"> 
          <Card className="p-10 border border-default bg-card/50 flex flex-col items-center justify-center text-center transition-all duration-300 group-hover:border-purple-500/50 group-hover:bg-purple-500/5 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] cursor-pointer">
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-4 transition-all duration-300 group-hover:bg-purple-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]">
              <Gamepad2 size={32} />
            </div>
            <p className="text-muted text-sm">Mode</p>
            <h3 className="text-xl font-bold text-foreground">Manual</h3>
            <p className="text-[10px] text-muted mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to control</p>
          </Card>
        </Link>
      </div> {/* ปิด div ของ Mode Selection ให้ถูกต้อง */}

      {/* 3. BOTTOM SECTION: Direction */}
      <Card className="p-8 border border-default bg-card flex flex-col items-center justify-center">
        <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          <Compass size={28} />
        </div>
        <p className="text-muted text-sm">Direction</p>
        <h3 className="text-lg font-bold text-foreground">North</h3>
      </Card>

      {/* 4. AI ASSISTANT SECTION */}
      <Card className="p-6 border border-default bg-card">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="text-teal-500" size={20} />
          <h2 className="font-bold text-foreground">AI Assistant</h2>
          <span className="bg-green-500/20 text-green-500 text-[10px] px-2 py-0.5 rounded uppercase">Online</span>
        </div>
        
        <div className="bg-background rounded-2xl p-4 mb-4 min-h-[100px] flex items-start gap-4 border border-default">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">AI</div>
          <p className="text-sm text-foreground pt-1">
            Hello! I'm your AI assistant. How can I help you with your boat control system today?
          </p>
        </div>

        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="flex-1 bg-background border border-default rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
          />
          <button className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-[0_0_15px_rgba(20,184,166,0.4)] transition-all">
             <Send size={18} /> Send
          </button>
        </div>
      </Card>

    </div>
  );
}