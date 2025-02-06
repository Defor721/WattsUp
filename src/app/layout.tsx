import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Toaster } from "@/components/shadcn/toaster";
import { MSWProvider, QueryProvider } from "@/config";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import FloatingButton from "@/components/floating-button/FloatingButton";
import CheckAccessTokenClient from "@/auth/components/common/CheckAccessTokenClient";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "WATTSUP",
  description: "WattsUp에서 에너지 거래 및 분석을 시작하세요.",
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: baseUrl,
    siteName: "WattsUp Energy Dashboard",
    title: "WATTSUP",
    description: "WattsUp에서 에너지 거래 및 분석을 시작하세요.",
    images: [
      {
        url: "/assets/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "WattsUp 로고",
      },
    ],
  },
};

if (process.env.NODE_ENV !== "production" && typeof window === "undefined") {
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
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <CheckAccessTokenClient />
              {children}
              <FloatingButton />
              <Toaster />
            </ThemeProvider>
          </QueryProvider>
        </MSWProvider>
      </body>
    </html>
  );
}
