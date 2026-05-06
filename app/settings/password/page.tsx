"use client";

import Card from "@/components/Card";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // 1. Validation เบื้องต้น
    if (!current || !newPass || !confirm) {
      return setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
    }

    if (newPass.length < 6) {
      return setError("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
    }

    if (newPass !== confirm) {
      return setError("รหัสผ่านใหม่ไม่ตรงกัน");
    }

    setError("");
    setLoading(true);

    try {
      // 2. ดึง ID ผู้ใช้จาก LocalStorage (ที่เราเก็บไว้ตอน Login)
      const userId = localStorage.getItem("user_session");
      if (!userId) throw new Error("ไม่พบเซสชันการใช้งาน กรุณาเข้าสู่ระบบใหม่");

      // 3. ตรวจสอบก่อนว่ารหัสผ่านเดิม (Current Password) ถูกต้องไหม
      const { data: user, error: fetchError } = await supabase
        .from("profiles")
        .select("password")
        .eq("id", userId)
        .single();

      if (fetchError || user.password !== current) {
        throw new Error("รหัสผ่านเดิมไม่ถูกต้อง");
      }

      // 4. อัปเดตรหัสผ่านใหม่ลงในตาราง profiles
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ password: newPass })
        .match({ id: userId });

      if (updateError) throw updateError;

      alert("เปลี่ยนรหัสผ่านสำเร็จ!");
      router.back();
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground leading-none">
            Change Password
          </h1>
          <p className="text-sm text-muted">
            Update your account security
          </p>
        </div>
      </div>

      <Card className="p-8 border border-default bg-card shadow-lg space-y-6">
        {/* Current Password */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Current Password
          </label>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="Enter current password"
            className="bg-background border border-default rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-teal-500/50 transition"
          />
        </div>

        <div className="h-px bg-default w-full my-2" />

        {/* New Password */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            New Password
          </label>
          <input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="Enter new password"
            className="bg-background border border-default rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-teal-500/50 transition"
          />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            className="bg-background border border-default rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-teal-500/50 transition"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20">
            {error}
          </p>
        )}

        <div className="flex gap-4 pt-4 border-t border-default">
           <button
            onClick={() => router.back()}
            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-foreground font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-[2] py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold shadow-[0_4px_15px_rgba(20,184,166,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </Card>
    </div>
  );
}