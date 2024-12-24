import type { Metadata } from "next";
import { Inter } from "next/font/google";

// import { pretendard } from "@/fonts";

import "./globals.css";
import { Toaster } from "@/components/shadcn/toaster";
import { MSWProvider, QueryProvider } from "@/config";
import FloatingButton from "@/components/floatingButton/FloatingButton";
import { ThemeProvider } from "@/components/common/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WattsUp Energy Dashboard",
  description: "Energy trading and analysis platform",
  // openGraph: {
  //   type: "website",
  //   locale: "ko_KR",
  //   url: "#",
  //   siteName: "WattsUp Energy Dashboard",
  //   title: "WattsUp Energy Dashboard",
  //   description: "Energy trading and analysis platform!",
  // },
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
      <body className={`${inter.className} font-pretendard`}>
        <MSWProvider>
          {/* <QueryProvider> */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <FloatingButton />
            <Toaster />
          </ThemeProvider>
          {/* </QueryProvider> */}
        </MSWProvider>
      </body>
    </html>
  );
}
