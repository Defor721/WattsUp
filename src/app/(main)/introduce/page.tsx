"use client";

import { useState } from "react";

import { PowerMarketStructure } from "@/components/introduce/PowerMarket";
import TeamIntroduction from "@/components/introduce/WattsUpIntroduce";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/tabs";

function IntroducePage() {
  const [activeTab, setActiveTab] = useState("wattsup");

  return (
    <div className="container mx-auto bg-white p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid h-[50px] w-full grid-cols-2">
          <TabsTrigger
            value="wattsup"
            className="h-full border-1 hover:bg-slate-100"
          >
            WattsUp 소개
          </TabsTrigger>
          <TabsTrigger
            value="market"
            className="h-full border-1 hover:bg-slate-100"
          >
            전력시장 구조
          </TabsTrigger>
        </TabsList>
        <TabsContent value="wattsup">
          <TeamIntroduction />
        </TabsContent>
        <TabsContent value="market">
          <PowerMarketStructure />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default IntroducePage;
