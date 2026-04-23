"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { Video, Bot } from "lucide-react";

export default function DashboardPage() {
  const [weather, setWeather] = useState({
    condition: "รอ AI วิเคราะห์...",
    temp: "--",
    humidity: "--",
    wind: "--",
  });

  const [aiAdvice, setAiAdvice] = useState<string>("กำลังเตรียมข้อมูลสภาพอากาศ...");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const askAI = async (rawData: any) => {
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/weather-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weatherData: rawData }),
      });
      
      const aiData = await res.json();
      
      setWeather({
        condition: `${aiData.condition || "วิเคราะห์ล้มเหลว"} ${aiData.emoji || ""}`,
        temp: aiData.temp || rawData.temp,
        humidity: aiData.humidity || rawData.humidity,
        wind: aiData.wind || rawData.wind,
      });
      
      setAiAdvice(aiData.advice || "ไม่สามารถสรุปคำแนะนำได้");
    } catch (err) {
      setWeather({
        condition: "โหมดออฟไลน์",
        temp: rawData.temp,
        humidity: rawData.humidity,
        wind: rawData.wind,
      });
      setAiAdvice("การเชื่อมต่อ AI ขัดข้อง");
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=13.75&longitude=100.5&current_weather=true&hourly=relativehumidity_2m"
        );
        const data = await res.json();
        const current = data.current_weather;

        const rawData = {
          temp: `${current.temperature}°C`,
          humidity: `${data.hourly.relativehumidity_2m[0]}%`,
          wind: `${current.windspeed} km/h`,
        };

        askAI(rawData);
      } catch (err) {
        setWeather(prev => ({ ...prev, condition: "เชื่อมต่อล้มเหลว" }));
      }
    };
    fetchWeather();
  }, []);

  return (
    <div className="space-y-6">
      {/* ส่วนบน: Camera และ Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden bg-slate-900/50">
          <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
            <h2 className="flex items-center gap-2 font-medium text-gray-200">
              <Video size={18} /> Camera Feed
            </h2>
            <span className="bg-red-500 text-white text-[10px] px-3 py-1 rounded-full animate-pulse">● LIVE</span>
          </div>
          <div className="h-[420px] bg-slate-800/50 flex items-center justify-center italic text-gray-500">
            Waiting for video stream...
          </div>
        </Card>

        <Card className="p-6 bg-slate-900/50 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="font-medium text-gray-200 uppercase text-xs tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-400 rounded-full"></span> System Status
            </h2>
            <Row label="Format" value="1920 × 1080" />
            <Row label="FPS" value="30" />
            <Row label="Latency" value="45ms" />
          </div>

          <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
             <h3 className="flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase mb-2">
               <Bot size={16} /> Gemini AI Analysis
             </h3>
             <p className="text-[13px] text-gray-200 italic">
               {isAiLoading ? "กำลังวิเคราะห์..." : `"${aiAdvice}"`}
             </p>
          </div>
        </Card>
      </div>

      {/* ส่วนล่าง: Weather Cards */}
      <Card className="p-8 bg-slate-900/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <WeatherCard color="from-orange-500 to-yellow-400" icon="🌦️" title="สรุปอากาศ" value={weather.condition} />
          <WeatherCard color="from-blue-600 to-blue-400" icon="🌡️" title="อุณหภูมิ" value={weather.temp} />
          <WeatherCard color="from-emerald-600 to-emerald-400" icon="💧" title="ความชื้น" value={weather.humidity} />
          <WeatherCard color="from-slate-600 to-slate-400" icon="🌬️" title="ความเร็วลม" value={weather.wind} />
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm border-b border-white/5 pb-2">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-200">{value}</span>
    </div>
  );
}

function WeatherCard({ icon, title, value, color }: { icon: string; title: string; value: string; color: string; }) {
  return (
    <div className={`h-40 rounded-3xl bg-gradient-to-br ${color} text-white flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-105`}>
      <div className="text-3xl mb-1">{icon}</div>
      <p className="text-[10px] opacity-70 uppercase font-bold tracking-widest">{title}</p>
      <h2 className="font-bold text-lg mt-1 px-4">{value}</h2>
    </div>
  );
}