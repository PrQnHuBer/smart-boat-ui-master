"use client";

import { useState } from "react";
import { supabase } from "@/supabase";
import { useRouter } from "next/navigation";
import { Anchor, User, Lock, Loader2 } from "lucide-react";
import Card from "@/components/Card";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ตรวจสอบ Username และ Password จากตาราง profiles ใน Supabase
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .single();

      if (fetchError || !data) {
        throw new Error("Username หรือ Password ไม่ถูกต้อง");
      }

      // บันทึก ID ผู้ใช้ลงใน localStorage เพื่อใช้ยืนยันตัวตนในหน้าอื่นๆ
      localStorage.setItem("user_session", data.id);
      
      // ส่งผู้ใช้กลับไปที่หน้า Home (/)
      router.push("/");
      router.refresh();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Anchor size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white">Smart Boat</h1>
          <p className="text-slate-400 text-sm">Control System Login</p>
        </div>

        <Card className="p-8 bg-[#1a2233] border-white/5 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                <User size={14} /> Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0f172a] border border-white/10 p-4 rounded-xl text-white outline-none focus:border-teal-500 transition"
                placeholder="กรอกชื่อผู้ใช้งาน"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                <Lock size={14} /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0f172a] border border-white/10 p-4 rounded-xl text-white outline-none focus:border-teal-500 transition"
                placeholder="กรอกรหัสผ่าน"
              />
            </div>

            {error && <div className="text-xs text-red-400 text-center">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-[#0f172a] font-black rounded-xl transition shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "เข้าสู่ระบบ"}
            </button>
          </form>
        </Card>
        <p className="text-center text-slate-600 text-[10px] uppercase font-bold tracking-widest">© 2026 Smart Boat Control Team</p>
      </div>
    </div>
  );
}