import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Menu } from "lucide-react";

import Sidebar from "@/components/sidebar/Sidebar";
import { Toaster } from "@/components/shadcn/toaster";
import { SidebarStateWrapper } from "@/components/sidebar/SidebarStateWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WattsUp Energy Dashboard",
  description: "Energy trading and analysis platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex">
          <Sidebar />
          <SidebarStateWrapper>
            <main className="flex-1 bg-[#F9FAFB] text-[rgb(7,15,38)]">
              {children}
            </main>
            <Toaster />
          </SidebarStateWrapper>
        </div>
      </body>
    </html>
  );
}
