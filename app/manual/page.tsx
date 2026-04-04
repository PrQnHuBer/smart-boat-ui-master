"use client";

import React, { useState } from "react";
import Card from "@/components/Card";
import { 
  ArrowLeft, ArrowUp, ArrowDown, Square, 
  RotateCcw, RotateCw, Droplets, Fan, 
  Settings2, MoveHorizontal
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ManualControlPage() {
  const router = useRouter();
  
  // --- States สำหรับควบคุมการทำงาน ---
  const [servoAngle, setServoAngle] = useState(0);
  const [leftValve, setLeftValve] = useState(false); // false = Closed, true = Opened
  const [rightValve, setRightValve] = useState(false);
  const [fanMode, setFanMode] = useState("Stop"); // Forward, Stop, Backward

  // ฟังก์ชันหมุน Servo แบบปุ่ม +-
  const rotateServo = (step: number) => {
    setServoAngle((prev) => {
      const next = prev + step;
      return next > 180 ? 180 : next < -180 ? -180 : next;
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-[1600px] mx-auto min-h-screen">
      
      {/* --- LEFT SIDEBAR: Quick Control --- */}
      <aside className="w-full lg:w-80 shrink-0">
        <Card className="p-5 border border-default bg-card space-y-6 sticky top-4">
          <div className="flex items-center gap-2 mb-4 border-b border-default pb-4">
            <Settings2 size={18} className="text-teal-500" />
            <h2 className="font-bold text-foreground">Quick Control</h2>
          </div>

          {/* Valve Section (Sync กับตัวหลัก) */}
          <section className="space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-muted font-bold">Valves</p>
            <div className={`flex justify-between items-center p-3 rounded-xl border transition-colors ${leftValve ? "bg-blue-500/20 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]" : "bg-background border-default"}`}>
              <span className="text-xs text-foreground flex items-center gap-2"><ArrowLeft size={14}/> Left</span>
              <span className={`text-xs font-bold ${leftValve ? "text-blue-400" : "text-muted"}`}>{leftValve ? "ON" : "OFF"}</span>
            </div>
            <div className={`flex justify-between items-center p-3 rounded-xl border transition-colors ${rightValve ? "bg-blue-500/20 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]" : "bg-background border-default"}`}>
              <span className="text-xs text-foreground flex items-center gap-2"><MoveHorizontal size={14}/> Right</span>
              <span className={`text-xs font-bold ${rightValve ? "text-blue-400" : "text-muted"}`}>{rightValve ? "ON" : "OFF"}</span>
            </div>
          </section>

          {/* Servo Section */}
          <section className="space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-muted font-bold">Servo</p>
            <div className="bg-background text-center py-4 rounded-xl border border-default shadow-inner">
              <h3 className="text-2xl font-bold text-foreground">{servoAngle}°</h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 22.5, 45, 270].map((angle) => (
                <button 
                  key={angle} 
                  onClick={() => setServoAngle(angle > 180 ? angle - 360 : angle)}
                  className={`py-2 text-[10px] rounded-lg font-bold border transition-all ${servoAngle === (angle > 180 ? angle - 360 : angle) ? "bg-teal-500 text-white border-teal-400 shadow-md" : "bg-teal-500/10 text-teal-500 border-teal-500/20 hover:bg-teal-500/20"}`}
                >
                  {angle}°
                </button>
              ))}
            </div>
          </section>

          {/* Fan Section (Quick View) */}
          <section className="space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-muted font-bold">Fan</p>
            <div className={`w-full py-3 rounded-xl text-xs flex items-center justify-center gap-2 font-bold transition-all ${fanMode === "Forward" ? "bg-green-500 text-white shadow-lg shadow-green-500/30" : "bg-muted/10 text-muted"}`}><ArrowUp size={14}/> Forward</div>
            <div className={`w-full py-3 rounded-xl text-xs flex items-center justify-center gap-2 font-bold transition-all ${fanMode === "Stop" ? "bg-white/10 text-white border border-white/20" : "bg-muted/10 text-muted"}`}><Square size={14}/> Stop</div>
            <div className={`w-full py-3 rounded-xl text-xs flex items-center justify-center gap-2 font-bold transition-all ${fanMode === "Backward" ? "bg-red-500 text-white shadow-lg shadow-red-500/30" : "bg-muted/10 text-muted"}`}><ArrowDown size={14}/> Backward</div>
          </section>
        </Card>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="px-4 py-2 bg-muted/20 hover:bg-muted/30 text-foreground rounded-lg flex items-center gap-2 text-sm transition border border-default group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground leading-none">Manual Control</h1>
            <p className="text-muted text-[11px] mt-1">ควบคุมเรือด้วยตนเอง</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. Valve Control Card */}
          <Card className="p-6 border border-default bg-card shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400"><Droplets size={18} /></div>
              <h2 className="font-bold text-foreground">Valve Control</h2>
            </div>
            <p className="text-muted text-[11px] mb-6 ml-9">เปิด/ปิดวาล์วทั้ง 2 ข้าง</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setLeftValve(!leftValve)}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all active:scale-95 ${leftValve ? "bg-blue-500 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]" : "bg-muted/10 border-default hover:bg-muted/20"}`}
              >
                <div className={`p-3 rounded-lg ${leftValve ? "bg-white text-blue-500" : "bg-blue-500/20 text-blue-400"}`}><ArrowLeft size={20}/></div>
                <div className="text-center">
                  <p className={`text-xs font-bold ${leftValve ? "text-white" : "text-foreground"}`}>Left Valve</p>
                  <p className={`text-[10px] ${leftValve ? "text-blue-100" : "text-muted"}`}>{leftValve ? "Opened" : "Closed"}</p>
                </div>
              </button>

              <button 
                onClick={() => setRightValve(!rightValve)}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all active:scale-95 ${rightValve ? "bg-blue-500 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]" : "bg-muted/10 border-default hover:bg-muted/20"}`}
              >
                <div className={`p-3 rounded-lg ${rightValve ? "bg-white text-blue-500" : "bg-blue-500/20 text-blue-400"}`}><MoveHorizontal size={20}/></div>
                <div className="text-center">
                  <p className={`text-xs font-bold ${rightValve ? "text-white" : "text-foreground"}`}>Right Valve</p>
                  <p className={`text-[10px] ${rightValve ? "text-blue-100" : "text-muted"}`}>{rightValve ? "Opened" : "Closed"}</p>
                </div>
              </button>
            </div>
          </Card>

          {/* 2. Servo Control Card (แก้ไขตามรูปที่ 2) */}
          <Card className="p-6 border border-default bg-card shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400"><RotateCw size={18} /></div>
              <h2 className="font-bold text-foreground">Servo Control</h2>
            </div>
            <p className="text-muted text-[11px] mb-6 ml-9">หมุน Servo 360 องศา</p>
            
            {/* Visual Gauge */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-[#2d3748]/50 rounded-full border-4 border-muted/10 shadow-inner"></div>
              <div 
                className="absolute top-1/2 left-1/2 w-1 h-12 bg-teal-400 origin-top rounded-full transition-transform duration-500 ease-out z-20"
                style={{ 
                  transform: `translate(-50%, 0%) rotate(${servoAngle + 180}deg)`,
                  boxShadow: '0 0 10px rgba(45, 212, 191, 0.5)'
                }}
              >
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-teal-400 rounded-full"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black text-white drop-shadow-md">{servoAngle}°</span>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-2 mb-6">
              <input type="range" min="-180" max="180" value={servoAngle} onChange={(e) => setServoAngle(parseInt(e.target.value))} className="w-full h-1.5 bg-muted/20 rounded-lg appearance-none cursor-pointer accent-teal-500" />
              <div className="flex justify-between text-[10px] text-muted px-1">
                <span>-180°</span><span>-90°</span><span>0°</span><span>90°</span><span>180°</span>
              </div>
            </div>

            {/* Go Input */}
            <div className="flex gap-2 mb-6">
               <input type="text" placeholder="0-360" className="flex-1 bg-background border border-default rounded-lg px-4 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-teal-500" />
               <button className="bg-teal-500 hover:bg-teal-400 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-lg shadow-teal-500/20">Go</button>
            </div>

            {/* Rotate Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => rotateServo(-45)} className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-xl text-[11px] font-bold shadow-[0_4px_15px_rgba(249,115,22,0.4)] transition-all flex flex-col items-center gap-1 active:scale-95">
                <div className="flex items-center gap-2"><RotateCcw size={14} /> <span>Rotate Left</span></div>
                <span className="text-[9px] opacity-80 font-normal">หมุนซ้าย (-45°)</span>
              </button>
              <button onClick={() => rotateServo(45)} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl text-[11px] font-bold shadow-[0_4px_15px_rgba(59,130,246,0.4)] transition-all flex flex-col items-center gap-1 active:scale-95">
                <div className="flex items-center gap-2"><RotateCw size={14} /> <span>Rotate Right</span></div>
                <span className="text-[9px] opacity-80 font-normal">หมุนขวา (+45°)</span>
              </button>
            </div>
          </Card>
        </div>

        {/* 3. Fan Control Section */}
        <Card className="p-6 border border-default bg-card shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 bg-teal-500/20 rounded-lg text-teal-400"><Fan size={18} /></div>
            <h2 className="font-bold text-foreground">Fan Control</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={() => setFanMode("Forward")}
              className={`flex flex-col items-center gap-4 p-8 rounded-2xl border transition-all active:scale-95 ${fanMode === "Forward" ? "bg-green-500 border-green-400 text-white shadow-[0_0_25px_rgba(34,197,94,0.4)]" : "bg-muted/10 border-default text-muted hover:bg-muted/20"}`}
            >
              <ArrowUp size={24} />
              <div className="text-center"><p className="text-xs font-bold">Forward</p> {fanMode === "Forward" && <span className="text-[10px] opacity-80">● Active</span>}</div>
            </button>

            <button 
              onClick={() => setFanMode("Stop")}
              className={`flex flex-col items-center gap-4 p-8 rounded-2xl border transition-all active:scale-95 ${fanMode === "Stop" ? "bg-white/10 border-white/30 text-white shadow-2xl" : "bg-muted/10 border-default text-muted hover:bg-muted/20"}`}
            >
              <Square size={24} />
              <div className="text-center"><p className="text-xs font-bold">Stop</p> {fanMode === "Stop" && <span className="text-[10px] text-teal-400 font-bold">● Active</span>}</div>
            </button>

            <button 
              onClick={() => setFanMode("Backward")}
              className={`flex flex-col items-center gap-4 p-8 rounded-2xl border transition-all active:scale-95 ${fanMode === "Backward" ? "bg-red-500 border-red-400 text-white shadow-[0_0_25px_rgba(239,68,68,0.4)]" : "bg-muted/10 border-default text-muted hover:bg-muted/20"}`}
            >
              <ArrowDown size={24} />
              <div className="text-center"><p className="text-xs font-bold">Backward</p> {fanMode === "Backward" && <span className="text-[10px] opacity-80">● Active</span>}</div>
            </button>
          </div>
        </Card>

        {/* 4. Current Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Left Valve", val: leftValve ? "Opened" : "Closed", color: leftValve ? "bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]" : "bg-muted/5 text-muted border-default" },
            { label: "Right Valve", val: rightValve ? "Opened" : "Closed", color: rightValve ? "bg-purple-500/20 text-purple-400 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.1)]" : "bg-muted/5 text-muted border-default" },
            { label: "Servo Angle", val: `${servoAngle}°`, color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
            { label: "Fan Mode", val: fanMode, color: fanMode === "Forward" ? "bg-green-500/10 text-green-400" : fanMode === "Backward" ? "bg-red-500/10 text-red-400" : "bg-muted/10 text-muted" },
          ].map((item, idx) => (
            <div key={idx} className={`p-4 rounded-xl border transition-all duration-300 ${item.color}`}>
              <p className="text-[10px] opacity-70 mb-1 font-bold uppercase tracking-tighter">{item.label}</p>
              <p className="text-sm font-black">{item.val}</p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}