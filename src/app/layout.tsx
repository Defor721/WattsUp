import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Menu } from "lucide-react";

import Sidebar from "@/components/sidebar/Sidebar";
import { Toaster } from "@/components/shadcn/toaster";
import { SidebarStateWrapper } from "@/components/sidebar/SidebarStateWrapper";
import { MSWProvider, QueryProvider } from "@/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WattsUp Energy Dashboard",
  description: "Energy trading and analysis platform",
};

// 서버 컴포넌트 일때 msw 사용을 위한 조건문
if (
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_RUNTIME === "nodejs"
) {
  import("@/mocks/http");
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex justify-center">
        <MSWProvider>
          <QueryProvider>
            <Sidebar />
            <main className="flex-1 bg-[rgb(7,15,38)] p-4 text-white">
              {children}
              <Toaster />
            </main>
          </QueryProvider>
        </MSWProvider>
      </body>
    </html>
  );
}
