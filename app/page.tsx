"use client"; // แจ้งว่าเป็น Client Component เพื่อให้สามารถใช้ Hook (useState, useEffect) ได้

import React, { useState, useEffect, useRef } from "react";
import Card from "@/components/Card";
import { Cpu, Gamepad2, Calendar, Clock, Activity } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import Header from "@/components/Header";
import mqtt from "mqtt"; 

export default function HomePage() {
  const router = useRouter(); 
  const clientRef = useRef<mqtt.MqttClient | null>(null); 
  const [isAuto, setIsAuto] = useState(false); 
  const [currentTime, setCurrentTime] = useState(""); 
  const [currentDate, setCurrentDate] = useState(""); 
  const [isAuthLoading, setIsAuthLoading] = useState(true); 

  useEffect(() => {
    const options = {
      protocol: 'wss' as const,
      host: 'f60614e0b5ff4800b92f0de2ce5b67fe.s1.eu.hivemq.cloud',
      port: 8884,
      path: '/mqtt',
      username: 'Project',
      password: 'Sau12345678',
    };

    const client = mqtt.connect(`wss://${options.host}:${options.port}${options.path}`, options);
    client.on("connect", () => { console.log("HomePage connected to MQTT"); });
    clientRef.current = client;

    return () => { if (clientRef.current) clientRef.current.end(); };
  }, []);

  const handleToggleAuto = () => {
    const nextState = !isAuto;
    setIsAuto(nextState);
    if (clientRef.current?.connected) {
      const payload = nextState ? "auto_start" : "auto_stop";
      clientRef.current.publish("esp32/control", payload);
      console.log("Published:", payload);
    }
  };

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (!session) { router.replace("/login"); } else { setIsAuthLoading(false); }
  }, [router]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
      setCurrentDate(now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    // ปรับ p-4 md:p-6 และ w-full เพื่อให้ชิดขอบมากที่สุด
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] p-4 transition-colors duration-500 font-sans flex flex-col items-center">
      
      {/* ขยาย Header ให้เต็มความกว้าง */}
      <div className="w-full">

        {/* ส่วนเนื้อหาหลัก: เอา max-w-6xl ออกเพื่อให้ยืดชิดซ้ายขวา */}
        <div className="flex flex-col justify-center py-6 w-full">
          
          {/* --- SECTION: SYSTEM STATUS (ยืดเต็มหน้าจอ) --- */}
          <div className="grid grid-cols-1 mb-6 w-full">
            <Card className="p-5 md:p-7 bg-white dark:bg-[#1a2233] border-slate-200 dark:border-white/5 shadow-xl w-full">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-bold text-xl md:text-2xl text-slate-900 dark:text-white transition-colors">System Status</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium">Real-time monitoring active</p>
                </div>
                <div className="flex items-center gap-2 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                  </span>
                  <span className="text-[10px] text-teal-500 font-black uppercase tracking-widest">Running</span>
                </div>
              </div>

              {/* ปรับ Grid ของสถานะให้ขยายตามความกว้างหน้าจอ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
                {/* DATE */}
                <div className="bg-slate-50 dark:bg-[#1e293b]/50 p-4 md:p-5 rounded-2xl flex items-center gap-4 border border-slate-200 dark:border-white/5 transition-all hover:scale-[1.01] w-full">
                  <div className="p-4 bg-blue-500/20 text-blue-500 rounded-xl"><Calendar size={28}/></div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Current Date</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">{currentDate || "..."}</p>
                  </div>
                </div>

                {/* TIME */}
                <div className="bg-slate-50 dark:bg-[#1e293b]/50 p-4 md:p-5 rounded-2xl flex items-center gap-4 border border-slate-200 dark:border-white/5 transition-all hover:scale-[1.01] w-full">
                  <div className="p-4 bg-purple-500/20 text-purple-500 rounded-xl"><Clock size={28}/></div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Current Time</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">{currentTime || "..."}</p>
                  </div>
                </div>

                {/* STATUS */}
                <div className="bg-slate-50 dark:bg-[#1e293b]/50 p-4 md:p-5 rounded-2xl flex items-center gap-4 border border-slate-200 dark:border-white/5 transition-all hover:scale-[1.01] w-full">
                  <div className="p-4 bg-teal-500/20 text-teal-500 rounded-xl"><Activity size={28}/></div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">System Mode</p>
                    <p className={`text-lg font-black ${isAuto ? "text-teal-500" : "text-purple-500"}`}>
                      {isAuto ? "Auto Mode" : "Manual Mode"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* --- SECTION: MODE SELECTION (ยืดเต็มหน้าจอแบ่ง 2 ฝั่ง) --- */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
            <button onClick={handleToggleAuto} className="text-left active:scale-[0.98] transition-all w-full">
              <Card className={`p-8 md:p-12 h-full flex flex-col items-center justify-center border-2 transition-all duration-500 rounded-[2rem] md:rounded-[2.5rem] w-full ${isAuto ? "bg-teal-500/10 border-teal-500 shadow-xl" : "bg-white dark:bg-[#1a2233] border-slate-200 dark:border-white/5"}`}>
                <div className={`p-5 rounded-2xl mb-5 transition-all duration-500 ${isAuto ? "bg-teal-500 text-white shadow-lg" : "bg-teal-500/10 text-teal-500"}`}>
                  <Cpu size={40} />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-widest mb-2">Operation</p>
                <h3 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white">Auto</h3>
              </Card>
            </button>

            <Link href="/manual" className="w-full block active:scale-[0.98] transition-all">
              <Card className="p-8 md:p-12 h-full flex flex-col items-center justify-center border-2 bg-white dark:bg-[#1a2233] border-slate-200 dark:border-white/5 hover:border-purple-500/50 transition-all duration-300 rounded-[2rem] md:rounded-[2.5rem] group w-full">
                <div className="p-5 rounded-2xl mb-5 bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                  <Gamepad2 size={40} />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-widest mb-2">Operation</p>
                <h3 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white">Manual</h3>
              </Card>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}