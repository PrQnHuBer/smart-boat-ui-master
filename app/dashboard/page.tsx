"use client";
import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { Bot, Navigation, Sun, Gauge, Thermometer, Droplets, Cloud } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<any>({
    temp: null, humidity: null, cloud: null, rain: null, 
    decision: null, reason: null, soil: null, light: null,
    lastUpdate: "--"
  });

  const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxm87HAs-l1_IXK63U2h10ZVFpfZgCySXW0b89L72vQB9Urwl0WwORmg6oSmWbfh0-w/exec";

  // ฟังก์ชันช่วยตรวจสอบและแสดงผล (ปรับปรุงตามเงื่อนไขล่าสุด)
  const formatValue = (value: any, unit: string = "") => {
    // 1. เช็คกรณีข้อมูลว่าง หรือ "หาค่าไม่เจอ"
    if (value === null || value === undefined || value === "หาค่าไม่เจอ" || value === "อ่านค่าไม่ได้") {
      return <span className="text-red-500 font-bold animate-pulse text-sm">หาค่าไม่เจอ</span>;
    }
    
    // 2. จัดการกรณีหน่วยเป็น % (แปลง 0.95 -> 95%)
    if (unit === "%") {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        // ถ้าค่า <= 1 (เช่น 0.95) ให้คูณ 100 | ถ้า > 1 (เช่น 95) ให้ใช้ค่าตรงๆ
        const displayNum = numValue <= 1 ? Math.round(numValue * 100) : Math.round(numValue);
        return `${displayNum}%`;
      }
    }
    
    return `${value}${unit}`;
  };

  const fetchAllData = async () => {
    try {
      const res = await fetch(GOOGLE_SHEET_URL);
      const json = await res.json();
      
      setData({
        ...json,
        lastUpdate: new Date().toLocaleTimeString('th-TH')
      });
    } catch (err) { 
      console.error("Fetch Error:", err); 
      setData((prev: any) => ({ ...prev, lastUpdate: "เชื่อมต่อล้มเหลว" }));
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 60000); // อัปเดตทุก 1 นาที
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center border-b border-default pb-4">
        <h1 className="text-2xl font-bold text-[#1a4d2e] dark:text-teal-400 font-sans">
          Smart Farm Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <p className="text-[12px] font-bold uppercase tracking-widest text-[#1a4d2e] dark:text-teal-400 px-1">
            ค่าจากเซนเซอร์จริง (MQTT)
          </p>
          <div className="space-y-3">
            <StatusCard icon={<Gauge className="text-emerald-500" />} title="ความชื้นในดิน" value={formatValue(data.soil, "%")} />
            <StatusCard icon={<Sun className="text-yellow-500" />} title="แสง" value={formatValue(data.light)} />
          </div>
        </div>

        <Card className="lg:col-span-2 p-8 rounded-3xl border border-default bg-card h-fit">
          <h2 className="flex items-center gap-2 font-bold mb-6 border-b border-default pb-2 text-[#1a4d2e] dark:text-teal-400">
            <Navigation size={18} /> STATUS DETAIL
          </h2>
          <div className="grid grid-cols-1 gap-4 font-medium text-sm">
            <InfoRow label="MQTT STATUS" value="Connected" status="text-teal-500 font-bold" />
            <InfoRow label="DATA SOURCE" value="Google Sheets API" />
            <InfoRow label="LAST UPDATE" value={data.lastUpdate} />
          </div>
        </Card>

        <Card className="p-8 rounded-3xl border border-default bg-card shadow-lg shadow-teal-500/5">
          <h2 className="flex items-center gap-2 font-bold mb-6 text-[#1a4d2e] dark:text-teal-400">
            <Bot size={20} /> AI Analysis
          </h2>
          <div className={`text-center py-8 border-2 border-dashed border-default rounded-[2rem] ${data.decision === "Yes" ? 'bg-green-500/5' : 'bg-slate-50 dark:bg-teal-500/10'}`}>
            <h1 className={`text-4xl font-black mb-2 ${data.decision === "Yes" ? "text-green-500" : (data.decision === "No" ? "text-red-500" : "text-gray-400")}`}>
              {data.decision === "Yes" ? "ควรรดน้ำ" : (data.decision === "No" ? "ไม่ต้องรดน้ำ" : "รอข้อมูล...")}
            </h1>
            <p className="text-muted text-xs italic px-4 leading-relaxed">{data.reason || "ไม่พบรายละเอียดเหตุผล"}</p>
          </div>
        </Card>
      </div>

      <div className="space-y-4 mt-8">
        <p className="text-[12px] font-bold uppercase tracking-widest text-[#1a4d2e] dark:text-teal-400 px-1">
            พยากรณ์อากาศ (API)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SmallCard title="อุณหภูมิ" value={formatValue(data.temp, "°C")} color="bg-green-600" />
          <SmallCard title="ความชื้นอากาศ" value={formatValue(data.humidity, "%")} color="bg-teal-500" />
          <SmallCard title="ความหนาแน่นเมฆ" value={formatValue(data.cloud, "%")} color="bg-emerald-600" />
          <SmallCard title="พยากรณ์ฝน" value={formatValue(data.rain, "mm")} color="bg-green-500" />
        </div>
      </div>
    </div>
  );
}

// --- Components ย่อย ---
function StatusCard({ icon, title, value }: any) {
  return (
    <div className="p-5 rounded-2xl border border-default bg-card flex items-center gap-4 shadow-sm hover:border-teal-500/30 transition-all">
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <p className="text-[10px] font-bold uppercase text-muted leading-tight">{title}</p>
        <div className="text-lg font-bold font-mono text-foreground leading-tight mt-1">{value}</div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, status }: any) {
  return (
    <div className="flex justify-between py-3 border-b border-default text-sm">
      <span className="text-muted">{label}</span>
      <span className={status || "text-foreground font-semibold"}>{value}</span>
    </div>
  );
}

function SmallCard({ title, value, color }: any) {
  return (
    <div className="rounded-3xl shadow-sm overflow-hidden text-center border border-default bg-card h-32 flex flex-col hover:-translate-y-1 transition-transform">
      <div className={`${color} py-3 text-white text-sm font-bold uppercase tracking-wider`}>{title}</div>
      <div className="flex-1 flex items-center justify-center text-3xl font-black font-mono text-foreground italic">{value}</div>
    </div>
  );
}