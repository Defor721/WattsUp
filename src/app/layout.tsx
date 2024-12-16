import type { Metadata } from "next";

// eslint-disable-next-line import/order
import pretendard from "../../public/assets/fonts";

import "./globals.css";
import Sidebar from "@/components/sidebar/Sidebar";
import { MSWProvider, QueryProvider } from "@/config";
import { Toaster } from "@/components/shadcn/toaster";
import { UserDropdown } from "@/components/sidebar/UserDropdown";

export const metadata: Metadata = {
  title: "Watts_uP - Energy Dashboard",
  description: "Real-time energy supply and demand monitoring dashboard",
};

// Server-side MSW setup for development
// if (
//   process.env.NEXT_PUBLIC_ENVIRONMENT === "development" &&
//   typeof window === "undefined"
// ) {
//   import("@/mocks/http").then(({ server }) => {
//     server.listen();
//   });
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pretendard.variable} flex bg-[rgb(7,15,38)] antialiased`}
      >
        {/* <MSWProvider> */}
        <QueryProvider>
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <main className="flex-1 bg-[#F9FAFB] text-[rgb(7,15,38)]">
              {children}
            </main>
            <Toaster />
          </div>
        </QueryProvider>
        {/* </MSWProvider> */}
      </body>
    </html>
  );
}
