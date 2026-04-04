import "./globals.css";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-background text-foreground min-h-screen">
        <div className="flex min-h-screen">

          {/* Sidebar */}
          <Sidebar />

          {/* Main */}
          <div className="flex-1 p-6 space-y-6">
            <Header />

            {children}
          </div>

        </div>
      </body>
    </html>
  );
}