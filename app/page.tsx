"use client";

import React, { useState, useEffect, useRef } from "react";
import Card from "@/components/Card";
import { 
  Cpu, Gamepad2, 
  Calendar, Clock, Activity, Sun, Bell, MessageSquare
} from "lucide-react";
import mqtt from "mqtt";
import Link from "next/link";

export default function BoatDashboard() {
  const [isAuto, setIsAuto] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const clientRef = useRef<mqtt.MqttClient | null>(null);

  // 1. จัดการเวลา Real-time
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. เชื่อมต่อ MQTT ไปยัง HiveMQ Cloud
  useEffect(() => {
    const client = mqtt.connect(`wss://f60614e0b5ff4800b92f0de2ce5b67fe.s1.eu.hivemq.cloud:8884/mqtt`, {
      username: 'Project',
      password: 'Sau12345678',
    });

    client.on("connect", () => {
      clientRef.current = client;
    });

    return () => { if (clientRef.current) clientRef.current.end(); };
  }, []);

  const sendCommand = (cmd: string) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish("esp32/control", cmd);
    }
  };

  const handleAutoToggle = () => {
    const nextState = !isAuto;
    setIsAuto(nextState);
    
    if (nextState) {
      sendCommand("auto_start");
    } else {
      sendCommand("auto_stop");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 text-slate-200 font-sans">
      
      {/* --- SYSTEM STATUS --- */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card className="p-6 bg-[#1a2233] border-white/5">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-bold text-lg text-white">System Status</h2>
              <p className="text-slate-500 text-xs font-medium">Real-time monitoring</p>
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
            <div className="bg-[#1e293b]/50 p-5 rounded-2xl flex items-center gap-4 border border-white/5">
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl"><Calendar size={20}/></div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Date</p>
                <p className="text-base font-bold">May 5, 2026</p>
              </div>
            </div>

            <div className="bg-[#1e293b]/50 p-5 rounded-2xl flex items-center gap-4 border border-white/5">
              <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl"><Clock size={20}/></div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Time</p>
                <p className="text-base font-bold">{currentTime || "08:07 PM"}</p>
              </div>
            </div>

            <div className="bg-[#1e293b]/50 p-5 rounded-2xl flex items-center gap-4 border border-white/5">
              <div className="p-3 bg-teal-500/20 text-teal-400 rounded-xl"><Activity size={20}/></div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Status</p>
                <p className={`text-base font-bold ${isAuto ? "text-teal-400" : "text-purple-400"}`}>
                  {isAuto ? "Auto Mode" : "Manual Mode"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* --- MODE SELECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <button onClick={handleAutoToggle} className="text-left active:scale-[0.98] transition-all">
          <Card className={`p-12 flex flex-col items-center justify-center border-2 transition-all duration-500 rounded-[2.5rem] ${isAuto ? "bg-[#1a2233] border-teal-500 shadow-2xl shadow-teal-500/10" : "bg-[#1a2233] border-white/5 hover:border-white/10"}`}>
            <div className={`p-5 rounded-2xl mb-4 transition-all duration-500 ${isAuto ? "bg-teal-500 text-white shadow-xl shadow-teal-500/40 rotate-[360deg]" : "bg-teal-500/10 text-teal-400"}`}>
              <Cpu size={40} />
            </div>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">Mode</p>
            <h3 className="text-3xl font-black text-white mb-2">Auto</h3>
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full">
              <span className={`w-2 h-2 rounded-full ${isAuto ? "bg-teal-400 animate-pulse" : "bg-slate-600"}`}></span>
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${isAuto ? "text-teal-400" : "text-slate-500"}`}>{isAuto ? "Active" : "Inactive"}</span>
            </div>
          </Card>
        </button>

        <Link href="/manual" className="text-left active:scale-[0.98] transition-all block">
          <Card className="p-12 h-full flex flex-col items-center justify-center border-2 border-white/5 bg-[#1a2233] hover:border-purple-500/30 transition-all duration-300 rounded-[2.5rem] group">
            <div className="p-5 rounded-2xl mb-4 bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              <Gamepad2 size={40} />
            </div>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">Mode</p>
            <h3 className="text-3xl font-black text-white mb-2">Manual</h3>
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-slate-600"></span>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">Go to Remote</span>
            </div>
          </Card>
        </Link>
      </div>

      {/* --- AI ASSISTANT (แก้ไขเป็น Link ไปยังหน้า assistant) --- */}
      <Link href="/assistant" className="block active:scale-[0.99] transition-all group">
        <Card className="p-6 bg-[#1a2233] border-white/5 rounded-[2.5rem] group-hover:border-teal-500/30 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
               <Activity size={16} className="text-teal-500"/>
               <span className="text-xs font-bold uppercase tracking-wider text-white">AI Assistant</span>
               <span className="bg-green-500/20 text-green-400 text-[9px] px-2 py-0.5 rounded-full font-bold animate-pulse">ONLINE</span>
            </div>
            <MessageSquare size={18} className="text-slate-500 group-hover:text-teal-400 transition-colors" />
          </div>
          <div className="bg-[#0f172a] p-5 rounded-2xl flex gap-4 items-start border border-white/5 shadow-inner">
             <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm text-white shadow-lg shadow-teal-500/20">AI</div>
             <div className="flex-1">
               <p className="text-sm text-slate-300 leading-relaxed italic mb-1">"Hello! I'm your AI assistant. Click here to chat with me or get advanced system analytics."</p>
               <p className="text-[10px] text-teal-500 font-bold uppercase tracking-tighter">Tap to open AI dashboard →</p>
             </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}