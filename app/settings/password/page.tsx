"use client";

import Card from "@/components/Card";
import { useState } from "react";
import { ArrowLeft } from "lucide-react"; // นำเข้าไอคอนย้อนกลับ
import { useRouter } from "next/navigation"; // นำเข้า useRouter

export default function ChangePasswordPage() {
  const router = useRouter(); // สร้าง instance ของ router
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!current || !newPass || !confirm) {
      return setError("Please fill all fields");
    }

    if (newPass.length < 6) {
      return setError("New password must be at least 6 characters");
    }

    if (newPass !== confirm) {
      return setError("Passwords do not match");
    }

    setError("");
    alert("Password updated successfully!");
    
    // ย้อนกลับไปหน้าก่อนหน้าหลังจากกดตกลง alert
    router.back();
  };

  return (
    <div className="space-y-8">
      
      {/* Header with Back Button (เหมือนรูปที่ 2) */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()} // ฟังชันย้อนกลับ
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

      {/* Form */}
      <Card className="p-6 border border-default bg-card shadow-lg space-y-6">

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
            className="
              bg-background
              border border-default
              rounded-xl px-4 py-3
              text-foreground
              placeholder:text-muted/50
              outline-none
              focus:ring-2 focus:ring-teal-500/50
              transition
            "
          />
        </div>

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
            className="
              bg-background
              border border-default
              rounded-xl px-4 py-3
              text-foreground
              placeholder:text-muted/50
              outline-none
              focus:ring-2 focus:ring-teal-500/50
              transition
            "
          />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            className="
              bg-background
              border border-default
              rounded-xl px-4 py-3
              text-foreground
              placeholder:text-muted/50
              outline-none
              focus:ring-2 focus:ring-teal-500/50
              transition
            "
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            {error}
          </p>
        )}

        {/* Button Container */}
        <div className="flex justify-end pt-4 border-t border-default">
          <button
            onClick={handleSave}
            className="
              px-8 py-3 rounded-xl
              bg-teal-500 hover:bg-teal-400
              text-white font-bold
              shadow-[0_4px_15px_rgba(20,184,166,0.3)]
              hover:shadow-[0_4px_20px_rgba(20,184,166,0.5)]
              transition-all duration-200
            "
          >
            Update Password
          </button>
        </div>

      </Card>
    </div>
  );
}