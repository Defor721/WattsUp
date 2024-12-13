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

<<<<<<< HEAD
// // 서버 컴포넌트 일때 msw 사용을 위한 조건문
// if (
//   process.env.NEXT_PUBLIC_ENVIRONMENT === "development" &&
//   typeof window === "undefined"
// ) {
//   import("@/mocks/http").then(({ server }) => {
//     server.listen();
//   });
// }
=======
// Server-side MSW setup for development
if (
  process.env.NEXT_PUBLIC_ENVIRONMENT === "development" &&
  typeof window === "undefined"
) {
  import("@/mocks/http").then(({ server }) => {
    server.listen();
  });
}
>>>>>>> edf38ac ([Feat] header 생성 & sidebar 수정 #68)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <body
        // className={`${geistSans.variable} ${geistMono.variable} flex antialiased`}
        className="flex"
      >
        {/* <MSWProvider> */}
        <QueryProvider>
          <Sidebar />
          <main className="flex-1 bg-[rgb(7,15,38)] p-4 text-white">
            {children}
            <Toaster />
          </main>
        </QueryProvider>
        {/* </MSWProvider> */}
=======
      <body className={`${pretendard.variable} flex antialiased`}>
        <MSWProvider>
          <QueryProvider>
            <Sidebar />
            <div className="flex flex-1 flex-col">
              <Header />
              <main className="flex-1 bg-[#F9FAFB] p-4 pt-[10vh] text-[rgb(7,15,38)]">
                {children}
              </main>
              <Toaster />
            </div>
          </QueryProvider>
        </MSWProvider>
>>>>>>> edf38ac ([Feat] header 생성 & sidebar 수정 #68)
      </body>
    </html>
  );
}
