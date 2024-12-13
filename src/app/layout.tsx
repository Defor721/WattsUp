import type { Metadata } from "next";

// eslint-disable-next-line import/order
import pretendard from "../../public/assets/fonts";

import "./globals.css";
import Sidebar from "@/components/sidebar/Sidebar";
import { MSWProvider, QueryProvider } from "@/config";
import { Toaster } from "@/components/shadcn/toaster";
import { Header } from "@/components/header/header";

export const metadata: Metadata = {
  title: "Watts_uP - Energy Dashboard",
  description: "Real-time energy supply and demand monitoring dashboard",
};

// 서버 컴포넌트 일때 msw 사용을 위한 조건문
if (
  process.env.NEXT_PUBLIC_ENVIRONMENT === "development" &&
  typeof window === "undefined"
) {
  import("@/mocks/http");
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} flex antialiased`}
        className="flex"
      >
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
