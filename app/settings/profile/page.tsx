"use client";

import Card from "@/components/Card";
import { useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("Woraprat");
  const [username, setUsername] = useState("woraprat");
  const [email, setEmail] = useState("woraprat@smartboat.com");

  const handleSave = () => {
    // Logic สำหรับบันทึกข้อมูล
    router.back();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-muted/10 text-muted transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground leading-none">Edit Profile</h1>
          <p className="text-muted text-sm mt-1">Update your personal information</p>
        </div>
      </div>

      {/* Main Form Card */}
      <Card className="p-8 border border-default bg-card shadow-lg space-y-8">
        
        {/* Profile Picture Section */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-foreground">Profile Picture</label>
          <div className="flex items-center gap-6">
            <div className="relative">
              {/* Avatar พร้อม Glow Effect ที่ปรับตามโหมด */}
              <div className="w-20 h-20 rounded-full bg-teal-500 flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_20px_rgba(20,184,166,0.4)]">
                W
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/10 hover:bg-muted/20 text-foreground text-sm transition border border-default">
              <Upload size={16} />
              Upload New Image
            </button>
          </div>
        </div>

        <div className="border-t border-default pt-8 space-y-5">
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background border border-default rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-teal-500/50 transition placeholder:text-muted/50"
            />
          </div>

          {/* Username */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-background border border-default rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-teal-500/50 transition placeholder:text-muted/50"
            />
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted">Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border border-default rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-teal-500/50 transition placeholder:text-muted/50"
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted">New Password (Optional)</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="bg-background border border-default rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-teal-500/50 transition placeholder:text-muted/50"
            />
            <p className="text-[11px] text-muted">Leave blank to keep your current password</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-default pt-8 flex gap-4">
          <button 
            onClick={() => router.back()}
            className="flex-1 py-3.5 rounded-xl bg-muted/10 hover:bg-muted/20 text-foreground font-semibold transition border border-default"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold shadow-[0_4px_15px_rgba(20,184,166,0.4)] transition"
          >
            Save Changes
          </button>
        </div>

      </Card>
    </div>
  );
}