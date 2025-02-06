"use client";

import { useState } from "react";

import { PowerMarket } from "@/components/introduce/PowerMarket";
import TeamIntroduction from "@/components/introduce/WattsUpIntroduce";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/tabs";
import { ESGItems } from "@/components/introduce/EsgItem";

// TODO: Metadata는 "use client" 해결 후 사용할 것
// import { Metadata } from "next";

// const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// export const metadata: Metadata = {
//   title: "내정보 - WATTSUP",
//   description: "WattsUp에서 에너지 거래 및 분석을 시작하세요.",
//   metadataBase: new URL(baseUrl),
//   openGraph: {
//     type: "website",
//     locale: "ko_KR",
//     url: `${baseUrl}/dashboard`,
//     siteName: "WattsUp Energy Dashboard",
//     title: "내정보 - WATTSUP",
//     description: "WattsUp에서 에너지 거래 및 분석을 시작하세요.",
//     images: [
//       {
//         url: "/assets/images/logo.webp",
//         width: 1200,
//         height: 630,
//         alt: "WattsUp 로고",
//       },
//     ],
//   },
// };

function IntroducePage() {
  const [activeTab, setActiveTab] = useState("wattsup");

  return (
    <div className="mx-auto max-w-[1920px] p-5 dark:bg-subColor dark:text-white md:w-full xl:p-10">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid h-[50px] w-full grid-cols-3">
          <TabsTrigger
            value="wattsup"
            className={`h-full border-1 hover:bg-slate-100 dark:hover:bg-slate-600 ${
              activeTab === "wattsup" ? "bg-slate-200" : ""
            }`}
          >
            WattsUp 소개
          </TabsTrigger>
          <TabsTrigger
            value="market"
            className={`h-full border-1 hover:bg-slate-100 dark:hover:bg-slate-600 ${
              activeTab === "market" ? "bg-slate-200" : ""
            }`}
          >
            전력시장 구조
          </TabsTrigger>
          <TabsTrigger
            value="esg"
            className={`h-full border-1 hover:bg-slate-100 dark:hover:bg-slate-600 ${
              activeTab === "esg" ? "bg-slate-200" : ""
            }`}
          >
            ESG 활동
          </TabsTrigger>
        </TabsList>
        <TabsContent value="wattsup">
          <TeamIntroduction />
        </TabsContent>
        <TabsContent value="market">
          <PowerMarket />
        </TabsContent>
        <TabsContent value="esg">
          <ESGItems />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default IntroducePage;
