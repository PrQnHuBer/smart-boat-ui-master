"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { Video, Bot } from "lucide-react";

export default function DashboardPage() {
  // เริ่มต้นด้วยสถานะ "รอ AI..." ทั้งหมด
  const [weather, setWeather] = useState({
    condition: "รอ AI วิเคราะห์...",
    temp: "--",
    humidity: "--",
    wind: "--",
  });

  const [aiAdvice, setAiAdvice] = useState<string>("กำลังเตรียมข้อมูลสภาพอากาศ...");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // ฟังก์ชันเรียก Ollama AI (Phi-3) เพื่อประมวลผลข้อมูลทั้งหมด
  const askAI = async (rawData: any) => {
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/weather-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weatherData: rawData }),
      });
      
      const aiData = await res.json();
      
      // AI จะเป็นผู้ส่งค่าที่ประมวลผลแล้วกลับมาอัปเดตทุก Card
      setWeather({
        condition: `${aiData.condition} ${aiData.emoji}`,
        temp: aiData.temp || rawData.temp,
        humidity: aiData.humidity || rawData.humidity,
        wind: aiData.wind || rawData.wind,
      });
      
      setAiAdvice(aiData.advice);
    } catch (err) {
      console.error("AI Error:", err);
      setAiAdvice("ไม่สามารถเชื่อมต่อกับ AI ได้ (โปรดตรวจสอบ Ollama)");
      // กรณี AI พัง ให้แสดงข้อมูลดิบแทน
      setWeather(prev => ({ ...prev, condition: "AI Offline ❌" }));
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // ดึงข้อมูลดิบจาก API สภาพอากาศ
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=13.75&longitude=100.5&current_weather=true&hourly=relativehumidity_2m"
        );

        const data = await res.json();
        const current = data.current_weather;

        // จัดรูปแบบข้อมูลดิบก่อนส่งให้ AI
        const rawData = {
          temp: `${current.temperature}°C`,
          humidity: `${data.hourly.relativehumidity_2m[0]}%`,
          wind: `${current.windspeed} km/h`,
        };

        // เรียก AI ให้สรุปผลทั้งหมด
        askAI(rawData);

      } catch (err) {
        console.error(err);
        setWeather({
          condition: "เชื่อมต่อล้มเหลว",
          temp: "--",
          humidity: "--",
          wind: "--",
        });
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="space-y-6">
      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-400 text-sm">Overview of your boat system statistics</p>
      </div>

      {/* TOP GRID */}
      <div className="grid grid-cols-3 gap-6">
        {/* CAMERA FEED */}
        <Card className="col-span-2 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
            <h2 className="flex items-center gap-2 font-medium">
              <Video size={18} /> Camera Feed
            </h2>
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">● LIVE</span>
          </div>
          <div className="relative h-[420px] bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center">
            <span className="absolute top-4 left-4 bg-black/60 px-3 py-1 text-xs rounded-full">CAM-01</span>
            <div className="text-center opacity-40">
              <Video size={50} className="mx-auto mb-3" />
              <p className="text-lg">Camera Feed</p>
              <p className="text-sm text-gray-400">Waiting for video stream...</p>
            </div>
          </div>
        </Card>

        {/* STATUS & AI ANALYSIS */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <h2 className="flex items-center gap-2 font-medium mb-6">
              <span className="w-2 h-2 bg-teal-400 rounded-full"></span> STATUS
            </h2>
            <div className="space-y-4 text-sm">
              <Row label="Format" value="1920 × 1080" />
              <Row label="FPS" value="30" />
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status</span>
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">Connected</span>
              </div>
              <Row label="Latency" value="45ms" />
            </div>
          </div>

          {/* AI ADVICE PANEL */}
          <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
             <h3 className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase mb-2">
               <Bot size={16} /> AI Assistant
             </h3>
             <p className="text-[13px] text-gray-200 leading-relaxed italic">
               {isAiLoading ? "AI กำลังประมวลผลข้อมูลอากาศ..." : `"${aiAdvice}"`}
             </p>
          </div>
        </Card>
      </div>

      {/* WEATHER CARDS (ALL AI CONTROLLED) */}
      <Card className="p-8">
        <h2 className="text-center mb-8 font-medium tracking-widest text-gray-400 uppercase text-xs">
          พยากรณ์อากาศประมวลผลด้วยระบบ AI
        </h2>
        <div className="flex justify-center gap-6 flex-wrap">
          <WeatherCard 
            color="from-orange-500 to-yellow-400" 
            icon="🌦️" 
            title="สรุปอากาศ" 
            value={weather.condition} 
          />
          <WeatherCard 
            color="from-blue-600 to-blue-400" 
            icon="🌡️" 
            title="อุณหภูมิ" 
            value={weather.temp} 
          />
          <WeatherCard 
            color="from-emerald-600 to-emerald-400" 
            icon="💧" 
            title="ความชื้น" 
            value={weather.humidity} 
          />
          <WeatherCard 
            color="from-slate-600 to-slate-400" 
            icon="🌬️" 
            title="ลม" 
            value={weather.wind} 
          />
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-gray-200">{value}</span>
    </div>
  );
}

function WeatherCard({ icon, title, value, color }: { icon: string; title: string; value: string; color: string; }) {
  return (
    <div className={`w-52 h-44 rounded-3xl bg-gradient-to-br ${color} text-white flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-105`}>
      <div className="text-3xl mb-1">{icon}</div>
      <p className="text-[10px] opacity-70 uppercase font-bold tracking-[2px]">{title}</p>
      <h2 className="font-extrabold text-lg text-center mt-1 px-3 leading-tight">
        {value}
      </h2>
    </div>
  );
}