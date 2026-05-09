"use client";

import Card from "@/components/Card";
import { GraduationCap, Mail, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Import รูปภาพ
import githubLogo from "../../images/Github.png";
import linkedinLogo from "../../images/linkedin.jpg";
import chatImg from "../../images/ฉัตร.jpg";
import muangImg from "../../images/ม่วง.jpg";
import mintImg from "../../images/มิ้น.jpg";
import heartImg from "../../images/ฮาท.jpg";
import sauLogo from "../../images/444.png"; 

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 p-4">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-full bg-muted/10 hover:bg-muted/20 text-muted transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground leading-none">About Us</h1>
          <p className="text-muted text-xs md:text-sm mt-1">Meet the team behind Smart Boat</p>
        </div>
      </div>

      {/* University Section */}
      <Card className="p-6 md:p-8 border border-default bg-card flex flex-col md:flex-row gap-6 items-center shadow-xl text-center md:text-left">
        <div className="relative shrink-0">
          {/* พื้นหลังไอคอนโลโก้เป็นสีขาวคงที่ตามที่ต้องการ */}
          <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center p-3 shadow-[0_0_25px_rgba(255,255,255,0.1)] border border-slate-200">
            <img 
              src={sauLogo.src} 
              alt="SAU Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-bold text-lg md:text-xl text-foreground">Southeast Asia University</h2>
          <div className="flex items-center justify-center md:justify-start gap-2 text-muted text-sm font-medium">
            <GraduationCap size={16} />
            <span>Faculty of Engineering</span>
          </div>
          <p className="text-sm text-muted leading-relaxed max-w-2xl">
            This project is developed as part of the Senior Project in Computer Engineering. 
            Our goal is to create an intelligent boat control system that leverages AI and IoT 
            technologies to enhance maritime navigation and safety.
          </p>
        </div>
      </Card>

      {/* Team Section */}
      <div>
        <h2 className="mb-5 font-bold text-foreground text-lg px-1">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <TeamCard 
            name="Woraprat Khruttamkham"  
            image={mintImg.src} 
            logo={sauLogo.src}
            roleColor="text-teal-400"
          />
          <TeamCard 
            name="Chatchai Chaisan"  
            image={muangImg.src} 
            logo={sauLogo.src}
            roleColor="text-blue-400"
          />
          <TeamCard 
            name="Chatsiri Taobumrung"  
            image={chatImg.src} 
            logo={sauLogo.src}
            roleColor="text-purple-400"
          />
          <TeamCard 
            name="Thada Siangwaong"
            image={heartImg.src} 
            logo={sauLogo.src}
            roleColor="text-orange-400"
          />
        </div>
      </div>

      {/* Project Info Section */}
      <Card className="p-6 md:p-8 border border-default bg-card shadow-lg">
        <h2 className="font-bold text-foreground mb-4 md:mb-6 text-lg">Project Information</h2>
        <div className="divide-y divide-default">
          <InfoRow label="Version" value="1.0.0" />
          <InfoRow label="Release Date" value="March 2026" />
          <InfoRow label="Technologies" value="React, TypeScript, Tailwind, IoT" />
          <InfoRow label="License" value="Academic Use Only" />
        </div>
      </Card>
    </div>
  );
}

// แก้ไขฟังก์ชัน TeamCard ให้ถูกต้อง
function TeamCard({ name, role, image, logo, roleColor }: any) {
  return (
    <Card className="p-5 md:p-6 border border-default bg-card transition-all duration-300 shadow-md group">
      <div className="flex items-center gap-4 md:gap-5">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-teal-500/20 shadow-lg shrink-0 group-hover:border-teal-500 transition-colors">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <p className="font-bold text-foreground truncate text-sm md:text-base">{name}</p>
          <p className={`text-xs md:text-sm font-medium ${roleColor}`}>{role}</p>
          
        </div>
      </div>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3 md:py-4 gap-2">
      <span className="text-muted text-xs md:text-sm font-medium shrink-0">{label}</span>
      <span className="text-foreground text-xs md:text-sm font-semibold text-right">{value}</span>
    </div>
  );
}