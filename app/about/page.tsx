"use client";

import Card from "@/components/Card";
import { GraduationCap, Mail, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-full bg-muted/10 hover:bg-muted/20 text-muted transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground leading-none">About Us</h1>
          <p className="text-muted text-sm mt-1">Meet the team behind Smart Boat</p>
        </div>
      </div>
      {/* University Section */}
      <Card className="p-8 border border-default bg-card flex gap-6 items-center shadow-xl">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-teal-500 flex items-center justify-center text-white shadow-[0_0_25px_rgba(20,184,166,0.4)]">
            <GraduationCap size={40} />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-bold text-xl text-foreground">Chulalongkorn University</h2>
          <div className="flex items-center gap-2 text-muted text-sm">
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
        <h2 className="mb-5 font-bold text-foreground text-lg">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TeamCard 
            name="Woraprat Chaiyakul" 
            role="Full Stack Developer" 
            email="woraprat@smartboat.com" 
            color="bg-teal-500" 
            initial="W" 
            roleColor="text-teal-400"
          />
          <TeamCard 
            name="Somchai Prasert" 
            role="AI Engineer" 
            email="somchai@smartboat.com" 
            color="bg-blue-500" 
            initial="S" 
            roleColor="text-blue-400"
          />
          <TeamCard 
            name="Anchana Wongsa" 
            role="UI/UX Designer" 
            email="anchana@smartboat.com" 
            color="bg-purple-500" 
            initial="A" 
            roleColor="text-purple-400"
          />
          <TeamCard 
            name="Preecha Tanaka" 
            role="IoT Specialist" 
            email="preecha@smartboat.com" 
            color="bg-orange-500" 
            initial="P" 
            roleColor="text-orange-400"
          />
        </div>
      </div>

      {/* Project Info Section */}
      <Card className="p-8 border border-default bg-card shadow-lg">
        <h2 className="font-bold text-foreground mb-6 text-lg">Project Information</h2>
        <div className="divide-y divide-default">
          <InfoRow label="Version" value="1.0.0" />
          <InfoRow label="Release Date" value="March 2026" />
          <InfoRow label="Technologies" value="React, TypeScript, Tailwind CSS, IoT" />
          <InfoRow label="License" value="Academic Use Only" />
        </div>
      </Card>
    </div>
  );
}

function TeamCard({ name, role, email, color, initial, roleColor }: any) {
  return (
    <Card className="p-6 border border-default bg-card hover:border-teal-500/30 transition-all duration-300 shadow-md">
      <div className="flex items-center gap-5 mb-6">
        <div className={`w-14 h-14 rounded-full ${color} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
          {initial}
        </div>

        <div className="space-y-1">
          <p className="font-bold text-foreground">{name}</p>
          <p className={`text-sm font-medium ${roleColor}`}>{role}</p>
          <div className="flex items-center gap-2 text-muted text-xs">
            <Mail size={14} />
            <span>{email}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 h-10 flex items-center justify-center bg-muted/10 hover:bg-muted/20 rounded-xl text-muted transition-colors border border-default">
          
        </button>
        <button className="flex-1 h-10 flex items-center justify-center bg-muted/10 hover:bg-muted/20 rounded-xl text-muted transition-colors border border-default">
          
        </button>
      </div>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-4">
      <span className="text-muted text-sm font-medium">{label}</span>
      <span className="text-foreground text-sm font-semibold">{value}</span>
    </div>
  );
}