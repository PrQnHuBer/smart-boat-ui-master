"use client";

import Card from "@/components/Card";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase";

export default function EditProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. ดึงข้อมูลโปรไฟล์ปัจจุบันจาก Supabase
  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, username, avatar_url")
        .single();

      if (data) {
        setName(data.full_name || "");
        setUsername(data.username || "");
        setAvatarUrl(data.avatar_url || null);
        setEmail("woraprat@smartboat.com"); 
      }
    }
    fetchProfile();
  }, []);

  // 2. ฟังก์ชันอัปโหลดรูปภาพไปยัง Supabase Storage
  const handleUploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars') 
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);
    } catch (error: any) {
      alert("Error uploading image: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // 3. ฟังก์ชันบันทึกข้อมูลและบังคับโหลดข้อมูลใหม่ (Update Success Logic)
  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: name, 
          username: username,
          avatar_url: avatarUrl 
        })
        .match({ id: '550e8400-e29b-41d4-a716-446655440000' });

      if (error) throw error;

      alert("Profile updated successfully!");
      
      // บังคับให้หน้าเว็บโหลดข้อมูลใหม่จาก Database ทันทีและกลับไปหน้า settings
      window.location.href = "/settings"; 

    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      {/* --- Header --- */}
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

      <Card className="p-8 border border-default bg-card shadow-lg space-y-8">
        
        {/* --- Profile Picture Section --- */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-foreground">Profile Picture</label>
          <div className="flex items-center gap-6">
            <div className="relative">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Avatar" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-teal-500 flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_20px_rgba(20,184,166,0.4)]">
                  {name.charAt(0).toUpperCase() || "W"}
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <Loader2 className="animate-spin text-white" size={24} />
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleUploadImage} 
              accept="image/*" 
              className="hidden" 
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/10 hover:bg-muted/20 text-foreground text-sm transition border border-default disabled:opacity-50"
            >
              <Upload size={16} />
              {uploading ? "Uploading..." : "Upload New Image"}
            </button>
          </div>
        </div>

        {/* --- Form Fields --- */}
        <div className="border-t border-default pt-8 space-y-5">
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              className="bg-background border border-default rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-teal-500/50 transition placeholder:text-muted/50"
            />
          </div>

          {/* Username */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="bg-background border border-default rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-teal-500/50 transition placeholder:text-muted/50"
            />
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border border-default rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-teal-500/50 transition placeholder:text-muted/50"
            />
          </div>
        </div>

        {/* --- Action Buttons --- */}
        <div className="border-t border-default pt-8 flex gap-4">
          <button 
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3.5 rounded-xl bg-muted/10 hover:bg-muted/20 text-foreground font-semibold transition border border-default"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSave}
            disabled={loading || uploading}
            className="flex-1 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold shadow-[0_4px_15px_rgba(20,184,166,0.4)] transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </Card>
    </div>
  );
}