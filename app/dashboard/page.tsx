"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { Video } from "lucide-react";

export default function DashboardPage() {
  const [weather, setWeather] = useState({
    condition: "Loading...",
    temp: "--",
    humidity: "--",
    wind: "--",
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=13.75&longitude=100.5&current_weather=true&hourly=relativehumidity_2m"
        );

        const data = await res.json();
        const current = data.current_weather;

        setWeather({
          condition: getWeatherCondition(current.weathercode),
          temp: `${current.temperature}°C`,
          humidity: `${data.hourly.relativehumidity_2m[0]}%`,
          wind: `${current.windspeed} km/h`,
        });
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

      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-400 text-sm">
          Overview of your boat system statistics
        </p>
      </div>

      {/* TOP GRID */}
      <div className="grid grid-cols-3 gap-6">

        {/* CAMERA */}
        <Card className="col-span-2 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
            <h2 className="flex items-center gap-2 font-medium">
              <Video size={18} /> Camera Feed
            </h2>

            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
              ● LIVE
            </span>
          </div>

          <div className="relative h-[420px] bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center">

            <span className="absolute top-4 left-4 bg-black/60 px-3 py-1 text-xs rounded-full">
              CAM-01
            </span>

            <span className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 text-xs rounded-full">
              LIVE
            </span>

            <div className="text-center opacity-40">
              <Video size={50} className="mx-auto mb-3" />
              <p className="text-lg">Camera Feed</p>
              <p className="text-sm text-gray-400">
                Waiting for video stream...
              </p>
            </div>
          </div>
        </Card>

        {/* STATUS */}
        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-medium mb-6">
            <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
            STATUS
          </h2>

          <div className="space-y-4 text-sm">
            <Row label="Format" value="1920 × 1080" />
            <Row label="FPS" value="30" />

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Status</span>
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">
                Connected
              </span>
            </div>

            <Row label="Latency" value="45ms" />
          </div>
        </Card>
      </div>

      {/* WEATHER */}
      <Card className="p-8">
        <h2 className="text-center mb-8 font-medium">
          พยากรณ์อากาศ
        </h2>

        <div className="flex justify-center gap-6 flex-wrap">
          <WeatherCard
            color="from-orange-400 to-yellow-300"
            icon="☀️"
            title="สภาพอากาศ"
            value={weather.condition}
          />

          <WeatherCard
            color="from-blue-800 to-blue-600"
            icon="🌡️"
            title="อุณหภูมิ"
            value={weather.temp}
          />

          <WeatherCard
            color="from-teal-700 to-teal-500"
            icon="💧"
            title="ความชื้น"
            value={weather.humidity}
          />

          <WeatherCard
            color="from-gray-600 to-gray-500"
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
      <span>{value}</span>
    </div>
  );
}

function WeatherCard({
  icon,
  title,
  value,
  color,
}: {
  icon: string;
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className={`w-40 h-40 rounded-2xl bg-gradient-to-br ${color} text-white flex flex-col items-center justify-center shadow-md`}
    >
      <div className="text-2xl">{icon}</div>
      <p className="text-sm mt-2 opacity-80">{title}</p>
      <h2 className="font-bold">{value}</h2>
    </div>
  );
}

function getWeatherCondition(code: number) {
  if (code === 0) return "แดดจัด ☀️";
  if (code <= 3) return "มีเมฆ ⛅";
  if (code <= 48) return "หมอก 🌫️";
  if (code <= 67) return "ฝน 🌧️";
  if (code <= 77) return "หิมะ ❄️";
  if (code <= 99) return "พายุ ⛈️";
  return "ไม่ทราบ";
}