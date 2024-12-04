import type { Metadata } from "next";
/** Metadata : TypeScript를 사용하는 Next.js 프로젝트에서 타입(type)만 가져오기 위한 구문 */
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/sidebar/Sidebar";
import { QueryProviders } from "../../config/QueryProviders";

const geistSans = localFont({
        
  src: "../public/assets/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
        
const geistMono = localFont({
  src: "../public/assets/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",

    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
    

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

        
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
      >
        <QueryProviders>
          <Sidebar />
          <main className="flex-1 p-4 bg-[rgb(7,15,38)] text-white">
            {children}
          </main>
        </QueryProviders>
      </body>
    </html>
  );
}
