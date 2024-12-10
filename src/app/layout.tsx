import type { Metadata } from "next";
/** Metadata : TypeScript를 사용하는 Next.js 프로젝트에서 타입(type)만 가져오기 위한 구문 */
import localFont from "next/font/local";

import "./globals.css";
import Sidebar from "@/components/sidebar/Sidebar";
import { MSWProvider, QueryProvider } from "@/config";
import { Toaster } from "@/components/ui/toaster";

// const geistSans = localFont({
//   src: "/public/assets/fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });

// const geistMono = localFont({
//   src: "/assets/fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// 서버 컴포넌트 일때 msw 사용을 위한 조건문
if (
  process.env.NEXT_PUBLIC_ENVIRONMENT === "development" &&
  typeof window === "undefined"
) {
  import("@/mocks/http").then(({ server }) => {
    server.listen();
  });
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
