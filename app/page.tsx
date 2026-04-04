"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";

export default function Home() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const thaiTime = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Bangkok",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const thaiDate = now.toLocaleDateString("en-US", {
        timeZone: "Asia/Bangkok",
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      setTime(thaiTime);
      setDate(thaiDate);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">

      {/* Top Cards */}
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <p className="text-gray-400 text-sm">Date</p>
          <h2 className="text-lg font-semibold">{date}</h2>
        </Card>

        <Card>
          <p className="text-gray-400 text-sm">Time</p>
          <h2 className="text-lg font-semibold">{time}</h2>
        </Card>

        <Card>
          <p className="text-gray-400 text-sm">Status</p>
          <h2 className="text-lg font-semibold text-teal-500">
            Optimal
          </h2>
        </Card>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 border-2 border-teal-400">
          <div className="flex flex-col items-center justify-center h-full py-6">
            <div className="w-16 h-16 bg-teal-500 text-white rounded-xl flex items-center justify-center mb-4 text-xl">
              🤖
            </div>
            <p className="text-gray-400 text-sm">Mode</p>
            <h2 className="font-semibold">Auto</h2>
            <span className="text-teal-500 text-sm mt-1">● Active</span>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold mb-4">Control Panel</h2>

          <button className="w-full bg-green-500 hover:bg-green-600 transition text-white py-3 rounded-xl mb-3 shadow">
            ▶ Start System
          </button>

          <button className="w-full bg-red-500 hover:bg-red-600 transition text-white py-3 rounded-xl shadow">
            ⛔ Stop System
          </button>
        </Card>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <div className="flex flex-col items-center py-6">
            <div className="w-14 h-14 bg-purple-500 text-white rounded-xl flex items-center justify-center mb-4 text-lg">
              🎮
            </div>
            <p className="text-gray-400 text-sm">Mode</p>
            <h2 className="font-semibold">Manual</h2>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col items-center py-6">
            <div className="w-14 h-14 bg-green-500 text-white rounded-xl flex items-center justify-center mb-4 text-lg">
              🧭
            </div>
            <p className="text-gray-400 text-sm">Direction</p>
            <h2 className="font-semibold">North</h2>
          </div>
        </Card>
      </div>

    </div>
  );
}