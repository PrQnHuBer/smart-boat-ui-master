"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { Video, Bot } from "lucide-react"; // เพิ่มไอคอน Bot

export default function DashboardPage() {
  const [weather, setWeather] = useState({
    condition: "Loading...",
    temp: "--",
    humidity: "--",
    wind: "--",
  });

  // --- ส่วนที่เพิ่มใหม่: State สำหรับ AI ---
  const [aiAdvice, setAiAdvice] = useState<string>("กำลังรอข้อมูลสภาพอากาศ...");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // ฟังก์ชันเรียก Ollama ผ่าน API Route ที่เราสร้างไว้
  const askAI = async (weatherData: any) => {
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/weather-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weatherData }),
      });
      const data = await res.json();
      setAiAdvice(data.advice);
    } catch (err) {
      setAiAdvice("ไม่สามารถเชื่อมต่อกับ AI วิเคราะห์อากาศได้");
    } finally {
      setIsAiLoading(false);
    }
  };
  // ------------------------------------

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=13.75&longitude=100.5&current_weather=true&hourly=relativehumidity_2m"
        );

        const data = await res.json();
        const current = data.current_weather;

        const newWeather = {
          condition: getWeatherCondition(current.weathercode),
          temp: `${current.temperature}°C`,
          humidity: `${data.hourly.relativehumidity_2m[0]}%`,
          wind: `${current.windspeed} km/h`,
        };

        setWeather(newWeather);
        
        // --- ส่วนที่เพิ่มใหม่: เมื่อได้ข้อมูลอากาศแล้ว ให้ส่งต่อให้ AI ทันที ---
        askAI(newWeather);

      } catch (err) {
        console.error(err);
        setWeather({
          condition: "Error",
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
      {/* TITLE & TOP GRID (เหมือนเดิม) */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-400 text-sm">Overview of your boat system statistics</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* CAMERA CARD (เหมือนเดิม) */}
        <Card className="col-span-2 overflow-hidden">
           {/* ... โค้ดเดิมของคุณ ... */}
        </Card>

        {/* STATUS CARD (เหมือนเดิม) */}
        <Card className="p-6">
           {/* ... โค้ดเดิมของคุณ ... */}
        </Card>
      </div>

      {/* WEATHER SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ข้อมูลพยากรณ์อากาศเดิม (ปรับ Col span เพื่อให้มีที่วาง AI) */}
        <Card className="p-8 md:col-span-2">
          <h2 className="text-center mb-8 font-medium">พยากรณ์อากาศ</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <WeatherCard color="from-orange-400 to-yellow-300" icon="☀️" title="สภาพอากาศ" value={weather.condition} />
            <WeatherCard color="from-blue-800 to-blue-600" icon="🌡️" title="อุณหภูมิ" value={weather.temp} />
            <WeatherCard color="from-teal-700 to-teal-500" icon="💧" title="ความชื้น" value={weather.humidity} />
            <WeatherCard color="from-gray-600 to-gray-500" icon="🌬️" title="ลม" value={weather.wind} />
          </div>
        </Card>

        {/* --- ส่วนที่เพิ่มใหม่: AI Advice Card --- */}
        <Card className="p-6 border-l-4 border-blue-500 bg-gradient-to-b from-blue-500/5 to-transparent">
          <h2 className="flex items-center gap-2 font-medium mb-4 text-blue-400">
            <Bot size={20} /> AI วิเคราะห์การเดินเรือ
          </h2>
          <div className="text-sm leading-relaxed min-h-[100px]">
            {isAiLoading ? (
              <div className="flex items-center gap-2 text-gray-400 animate-pulse">
                <span>🤖 AI กำลังคิด...</span>
              </div>
            ) : (
              <p className="text-gray-200 italic">"{aiAdvice}"</p>
            )}
          </div>
          {!isAiLoading && (
            <button 
              onClick={() => askAI(weather)}
              className="mt-4 text-xs text-blue-400 hover:underline"
            >
              🔄 วิเคราะห์ใหม่อีกครั้ง
            </button>
          )}
        </Card>
      </div>
    </div>
  );
}

// ... Function Row, WeatherCard และ getWeatherCondition (เหมือนเดิม) ...