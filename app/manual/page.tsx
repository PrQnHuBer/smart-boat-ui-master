"use client";

import React, { useState, useEffect, useRef } from "react";
import Card from "@/components/Card";
import { 
  ArrowLeft, ArrowUp, ArrowDown, Square, 
  RotateCcw, RotateCw, Droplets, Fan, 
  Settings2, ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import mqtt from "mqtt";

export default function ManualControlPage() {
  const router = useRouter();
  const clientRef = useRef<mqtt.MqttClient | null>(null);
  
  // --- States สำหรับเก็บสถานะปัจจุบัน ---
  const [servoAngle, setServoAngle] = useState(0);
  const [leftValve, setLeftValve] = useState(false);
  const [rightValve, setRightValve] = useState(false);
  const [fanMode, setFanMode] = useState("Stop");

  // 1. การเชื่อมต่อ MQTT ผ่าน WebSocket Secure (HiveMQ Cloud)
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

    client.on("connect", () => {
      console.log("Connected to HiveMQ Cloud");
    });

    clientRef.current = client;

    return () => {
      if (clientRef.current) clientRef.current.end();
    };
  }, []);

  // ฟังก์ชันสำหรับส่งคำสั่ง MQTT
  const sendCommand = (cmd: string) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish("esp32/control", cmd);
      console.log("Sent Command:", cmd);
    }
  };

  // --- Handlers สำหรับควบคุม ---

  // จัดการวาล์ว (เปิด/ปิดแยกอิสระ)
  const handleValve = (side: "L" | "R") => {
    if (side === "L") {
      const newState = !leftValve;
      setLeftValve(newState);
      sendCommand(newState ? "valveL_on" : "valveL_off");
    } else {
      const newState = !rightValve;
      setRightValve(newState);
      sendCommand(newState ? "valveR_on" : "valveR_off");
    }
  };

  // จัดการการเคลื่อนที่ (เดินหน้า-ถอยหลัง)
  const handleMove = (mode: string) => {
    setFanMode(mode);
    if (mode === "Forward") sendCommand("forward");
    else if (mode === "Backward") sendCommand("backward");
    else sendCommand("move_stop"); // คำสั่งนี้จะไม่ปิดวาล์วน้ำใน ESP32
  };

  // จัดการการเลี้ยวแบบองศา (เปลี่ยนชื่อเป็น Turn และวนลูป 0-360)
  const handleTurnStep = (dir: "L" | "R") => {
    setServoAngle(prev => {
      const next = dir === "L" ? prev - 22.5 : prev + 22.5;
      return (next + 360) % 360; // Modulo เพื่อให้วนรอบกลับมาที่ 0
    });
    // ส่งคำสั่งชื่อ "Turn" ไปที่บอร์ด
    sendCommand(dir === "L" ? "Turn_L_22.5" : "Turn_R_22.5");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-[1600px] mx-auto min-h-screen text-slate-200">
      
      {/* --- SIDEBAR: Quick Control --- */}
      <aside className="w-full lg:w-80 shrink-0">
        <Card className="p-5 border border-white/5 bg-[#1a2233] space-y-6 sticky top-4 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <Settings2 size={20} className="text-teal-500" />
            <h2 className="text-lg font-bold text-white">Quick Control</h2>
          </div>

          {/* Valve Status Summary */}
          <section className="space-y-3">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Valves Status</p>
            <div className={`flex justify-between items-center p-3 rounded-xl border transition-all ${leftValve ? "bg-teal-500/10 border-teal-500/30" : "bg-[#0f172a] border-white/5"}`}>
              <span className="text-xs font-bold flex items-center gap-2"><ArrowLeft size={16}/> Left Valve</span>
              <span className={`text-xs font-black ${leftValve ? "text-teal-400" : "text-slate-500"}`}>{leftValve ? "ON" : "OFF"}</span>
            </div>
            <div className={`flex justify-between items-center p-3 rounded-xl border transition-all ${rightValve ? "bg-teal-500/10 border-teal-500/30" : "bg-[#0f172a] border-white/5"}`}>
              <span className="text-xs font-bold flex items-center gap-2"><ArrowRight size={16}/> Right Valve</span>
              <span className={`text-xs font-black ${rightValve ? "text-teal-400" : "text-slate-500"}`}>{rightValve ? "ON" : "OFF"}</span>
            </div>
          </section>

          {/* Servo Position Summary */}
          <section className="space-y-3 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Heading Position</p>
            <div className="bg-[#0f172a] py-6 rounded-xl border border-white/5">
              <h3 className="text-4xl font-black text-white">{servoAngle.toFixed(1)}°</h3>
            </div>
          </section>
        </Card>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="px-4 py-2 bg-[#1a2233] hover:bg-[#252f44] rounded-lg flex items-center gap-2 text-sm border border-white/5 transition active:scale-95">
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Manual Control Panel</h1>
            <p className="text-slate-500 text-[11px] mt-1">ควบคุมเรือผ่านระบบ HiveMQ Cloud</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 1. Valve Control Card */}
          <Card className="p-6 bg-[#1a2233] border border-white/5 rounded-3xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400"><Droplets size={20} /></div>
              <h2 className="font-bold text-lg">Valve Control</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleValve("L")} className={`p-8 rounded-2xl border-2 transition-all active:scale-95 ${leftValve ? "bg-blue-600 border-blue-400 shadow-lg" : "bg-[#0f172a] border-white/5"}`}>
                <ArrowLeft size={28} className="mx-auto mb-2" />
                <p className="text-sm font-bold">Left Valve</p>
              </button>
              <button onClick={() => handleValve("R")} className={`p-8 rounded-2xl border-2 transition-all active:scale-95 ${rightValve ? "bg-blue-600 border-blue-400 shadow-lg" : "bg-[#0f172a] border-white/5"}`}>
                <ArrowRight size={28} className="mx-auto mb-2" />
                <p className="text-sm font-bold">Right Valve</p>
              </button>
            </div>
          </Card>

          {/* 2. Turn Control Card (22.5°) */}
          <Card className="p-6 bg-[#1a2233] border border-white/5 rounded-3xl text-center shadow-lg">
            <div className="flex items-center gap-2 mb-4 justify-center">
              <div className="p-1.5 bg-teal-500/10 rounded-lg text-teal-400"><RotateCw size={20} /></div>
              <h2 className="font-bold text-lg">Turn Control (22.5°)</h2>
            </div>
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                <div 
                  className="w-1 h-10 bg-teal-400 origin-bottom transition-transform duration-300 shadow-[0_0_8px_rgba(45,212,191,0.5)]" 
                  style={{ transform: `rotate(${servoAngle}deg)` }}
                ></div>
                <span className="absolute font-black text-xl text-white">{servoAngle.toFixed(1)}°</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 px-2">
              <button onClick={() => handleTurnStep("L")} className="bg-orange-600 hover:bg-orange-500 p-3 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2">
                <RotateCcw size={16}/> Rotate Left
              </button>
              <button onClick={() => handleTurnStep("R")} className="bg-blue-600 hover:bg-blue-500 p-3 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
                <RotateCw size={16}/> Rotate Right
              </button>
            </div>
          </Card>
        </div>

        {/* 3. Motor Control Card (Colors & Status) */}
        <Card className="p-6 bg-[#1a2233] border border-white/5 rounded-3xl shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 bg-teal-500/10 rounded-lg text-teal-400"><Fan size={20} /></div>
            <h2 className="font-bold text-lg">Motor Control</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 lg:gap-8">
            <button 
              onClick={() => handleMove("Forward")} 
              className={`p-10 rounded-[2rem] border-2 transition-all active:scale-95 ${fanMode === "Forward" ? "bg-green-500 border-green-400 shadow-green-500/40 shadow-xl" : "bg-[#0f172a] border-white/5 text-slate-500"}`}
            >
              <ArrowUp size={36} className="mx-auto" />
              <p className="font-black text-sm mt-3 tracking-widest uppercase">Forward</p>
            </button>
            
            <button 
              onClick={() => handleMove("Stop")} 
              className={`p-10 rounded-[2rem] border-2 transition-all active:scale-95 ${fanMode === "Stop" ? "bg-red-500 border-red-400 shadow-red-500/40 shadow-xl" : "bg-[#0f172a] border-white/5 text-slate-500"}`}
            >
              <Square size={36} className="mx-auto" />
              <p className="font-black text-sm mt-3 tracking-widest uppercase">Stop</p>
            </button>
            
            <button 
              onClick={() => handleMove("Backward")} 
              className={`p-10 rounded-[2rem] border-2 transition-all active:scale-95 ${fanMode === "Backward" ? "bg-yellow-500 border-yellow-400 shadow-yellow-500/40 shadow-xl" : "bg-[#0f172a] border-white/5 text-slate-500"}`}
            >
              <ArrowDown size={36} className="mx-auto" />
              <p className="font-black text-sm mt-3 tracking-widest uppercase">Backward</p>
            </button>
          </div>
        </Card>
      </main>
    </div>
  );
}