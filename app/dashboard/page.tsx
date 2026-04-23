"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { Video, Bot } from "lucide-react";

export default function DashboardPage() {
  // สถานะเริ่มต้นสำหรับแสดงผล Weather Cards
  const [weather, setWeather] = useState({
    condition: "รอ AI วิเคราะห์...",
    temp: "--",
    humidity: "--",
    wind: "--",
  });

  const [aiAdvice, setAiAdvice] = useState<string>("กำลังเตรียมข้อมูลสภาพอากาศ...");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // ฟังก์ชันเรียก Gemini AI ผ่าน API Route ของเรา
  const askAI = async (rawData: any) => {
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/weather-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weatherData: rawData }),
      });
      
      if (!res.ok) throw new Error("AI Assistant Offline");

      const aiData = await res.json();
      
      // อัปเดตข้อมูล Weather Card ด้วยสิ่งที่ Gemini วิเคราะห์กลับมา
      // ใช้ || rawData เป็น Fallback ในกรณีที่ AI ส่งค่าว่างมา
      setWeather({
        condition: `${aiData.condition || "วิเคราะห์ล้มเหลว"} ${aiData.emoji || ""}`,
        temp: aiData.temp || rawData.temp,
        humidity: aiData.humidity || rawData.humidity,
        wind: aiData.wind || rawData.wind,
      });
      
      setAiAdvice(aiData.advice || "ขออภัย ไม่สามารถสรุปคำแนะนำได้ในขณะนี้");
    } catch (err) {
      console.error("AI Error:", err);
      // หากติดต่อ AI ไม่ได้ ให้แสดงข้อมูลดิบจาก API อากาศแทน เพื่อไม่ให้หน้าจอว่างเปล่า
      setWeather({
        condition: "โหมดออฟไลน์ (ข้อมูลดิบ)",
        temp: rawData.temp,
        humidity: rawData.humidity,
        wind: rawData.wind,
      });
      setAiAdvice("ไม่สามารถเชื่อมต่อกับระบบ AI ได้ในขณะนี้");
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // 1. ดึงข้อมูลดิบจาก Open-Meteo
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=13.75&longitude=100.5&current_weather=true&hourly=relativehumidity_2m"
        );

        const data = await res.json();
        const current = data.current_weather;

        // 2. จัดรูปแบบข้อมูลดิบ
        const rawData = {
          temp: `${current.temperature}°C`,
          humidity: `${data.hourly.relativehumidity_2m[0]}%`,
          wind: `${current.windspeed} km/h`,
        };

        // 3. ส่งข้อมูลดิบให้ Gemini ประมวลผลต่อทันที
        askAI(rawData);

      } catch (err) {
        console.error("Weather API Error:", err);
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
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm">Overview of your boat system statistics</p>
      </div>

      {/* TOP GRID: CAMERA & STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CAMERA FEED CARD */}
        <Card className="lg:col-span-2 overflow-hidden border-white/5 bg-slate-900/50">
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-white/5">
            <h2 className="flex items-center gap-2 font-medium text-gray-200">
              <Video size={18} className="text-blue-400" /> Camera Feed
            </h2>
            <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse">
              ● LIVE
            </span>
          </div>
          <div className="relative h-[420px] bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center">
            <span className="absolute top-4 left-4 bg-black/60 px-3 py-1 text-[10px] rounded-full text-gray-300">
              CAM-01
            </span>
            <div className="text-center opacity-30">
              <Video size={60} className="mx-auto mb-3 text-gray-400" />
              <p className="text-lg font-light text-gray-300">Video Stream</p>
              <p className="text-xs text-gray-500">Connecting to vessel camera...</p>
            </div>
          </div>
        </Card>

        {/* STATUS & AI ANALYSIS CARD */}
        <Card className="p-6 flex flex-col justify-between border-white/5 bg-slate-900/50">
          <div>
            <h2 className="flex items-center gap-2 font-medium mb-6 text-gray-200 uppercase tracking-tighter text-sm">
              <span className="w-2 h-2 bg-teal-400 rounded-full"></span> System Status
            </h2>
            <div className="space-y-4 text-sm">
              <Row label="Format" value="1920 × 1080" />
              <Row label="FPS" value="30" />
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Network</span>
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  Connected
                </span>
              </div>
              <Row label="Latency" value="45ms" />
            </div>
          </div>

          {/* AI ADVICE PANEL: ส่วนนี้จะโชว์คำแนะนำที่ Gemini วิเคราะห์มา */}
          <div className="mt-8 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
             <h3 className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase mb-2 tracking-widest">
               <Bot size={16} /> Gemini AI Analysis
             </h3>
             <p className="text-[13px] text-gray-200 leading-relaxed italic font-light">
               {isAiLoading ? (
                 <span className="animate-pulse">กำลังวิเคราะห์ความปลอดภัยในการเดินเรือ...</span>
               ) : (
                 `"${aiAdvice}"`
               )}
             </p>
          </div>
        </Card>
      </div>

      {/* WEATHER SECTION: ทุกค่าในนี้จะถูกกรองผ่าน AI อีกครั้ง */}
      <Card className="p-8 border-white/5 bg-slate-900/50">
        <h2 className="text-center mb-8 font-medium tracking-[0.2em] text-gray-500 uppercase text-[10px]">
          พยากรณ์อากาศประมวลผลด้วย Gemini 1.5 Flash
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
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
            title="ความเร็วลม" 
            value={weather.wind} 
          />
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-white/5 pb-2">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-gray-200">{value}</span>
    </div>
  );
}

function WeatherCard({ icon, title, value, color }: { icon: string; title: string; value: string; color: string; }) {
  return (
    <div className={`h-44 rounded-[2.5rem] bg-gradient-to-br ${color} text-white flex flex-col items-center justify-center shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-orange-500/10`}>
      <div className="text-4xl mb-1 drop-shadow-md">{icon}</div>
      <p className="text-[10px] opacity-70 uppercase font-black tracking-[2px]">{title}</p>
      <h2 className="font-bold text-xl text-center mt-1 px-4 leading-tight drop-shadow-sm">
        {value}
      </h2>
    </div>
  );
}