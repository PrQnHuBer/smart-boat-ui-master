import { User, Lock, Bell, Info } from "lucide-react";
import Card from "@/components/Card";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="space-y-8 p-4">
      {/* Title Section */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted text-sm">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Card */}
      <Card className="p-6 border border-default bg-card shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-teal-500 flex items-center justify-center text-xl font-bold text-white">
            W
          </div>

          <div>
            <h2 className="font-semibold text-lg text-foreground">Woraprat</h2>
            <p className="text-muted text-sm">
              woraprat@smartboat.com
            </p>
            <span className="inline-block mt-1 text-xs bg-green-500/20 text-green-600 dark:text-green-400 px-3 py-1 rounded-full">
              Administrator
            </span>
          </div>
        </div>

        <div className="border-t border-default my-6"></div>

        <div className="space-y-1">
          <Link href="/settings/profile" className="block">
            <SettingItem
              icon={<User size={18} />}
              title="Edit Profile"
              desc="Update your personal information"
            />
          </Link>

          <Link href="/settings/password" className="block">
            <SettingItem
              icon={<Lock size={18} />}
              title="Change Password"
              desc="Update your security credentials"
            />
          </Link>
        </div>
      </Card>

      {/* Preferences Section */}
      <Card className="p-6 border border-default bg-card shadow-sm">
        <h2 className="mb-4 font-medium text-foreground">Preferences</h2>

        <div className="flex items-center justify-between">
          <div className="flex gap-3 items-center">
            <div className="p-3 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
              <Bell size={18} />
            </div>
            <div>
              <p className="text-foreground">Notifications</p>
              <p className="text-sm text-muted">
                Receive system alerts and updates
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="w-11 h-6 bg-muted/30 rounded-full relative cursor-pointer transition-colors">
            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm transition-transform"></div>
          </div>
        </div>
      </Card>

      {/* About Section */}
      <Card className="p-6 border border-default bg-card shadow-sm">
        <SettingItem
          icon={<Info size={18} />}
          title="About Us"
          desc="Learn more about our team"
        />
      </Card>
    </div>
  );
}

function SettingItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center justify-between py-4 px-2 rounded-xl cursor-pointer hover:bg-muted/5 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
          {icon}
        </div>
        <div>
          <p className="text-foreground font-medium">{title}</p>
          <p className="text-sm text-muted">{desc}</p>
        </div>
      </div>

      <span className="text-muted text-xl">›</span>
    </div>
  );
}