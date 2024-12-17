import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Sidebar from "@/components/sidebar/Sidebar";
import { Toaster } from "@/components/shadcn/toaster";
import { SidebarStateWrapper } from "@/components/sidebar/SidebarStateWrapper";
import { MSWProvider, QueryProvider } from "@/config";
import { SidebarProvider, SidebarTrigger } from "@/components/shadcn/sidebar";
import AppSidebar from "@/components/appSidebar/AppSidebar";

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
      <body className={`${inter.className} flex`}>
        <MSWProvider>
          <QueryProvider>
            <SidebarProvider>
              {/* <SidebarStateWrapper> */}
              {/* <Sidebar /> */}
              <AppSidebar />
              <div className="flex flex-1 flex-col">
                <main className="ml-2 flex-1 bg-[#f9fafb] text-[rgb(7,15,38)]">
                  {/* <SidebarTrigger /> */}
                  {children}
                </main>
                <Toaster />
              </div>
              {/* </SidebarStateWrapper> */}
            </SidebarProvider>
          </QueryProvider>
        </MSWProvider>
      </body>
    </html>
  );
}
