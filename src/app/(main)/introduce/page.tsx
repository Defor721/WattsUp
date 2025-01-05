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

function IntroducePage() {
  const [activeTab, setActiveTab] = useState("wattsup");

  return (
    <div className="container mx-auto bg-white p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid h-[50px] w-full grid-cols-3">
          <TabsTrigger
            value="wattsup"
            className={`h-full border-1 hover:bg-slate-100 ${
              activeTab === "wattsup" ? "bg-slate-200" : ""
            }`}
          >
            WattsUp 소개
          </TabsTrigger>
          <TabsTrigger
            value="market"
            className={`h-full border-1 hover:bg-slate-100 ${
              activeTab === "market" ? "bg-slate-200" : ""
            }`}
          >
            전력시장 구조
          </TabsTrigger>
          <TabsTrigger
            value="esg"
            className={`h-full border-1 hover:bg-slate-100 ${
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
