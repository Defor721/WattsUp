"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, BarChart3, Users, LeafyGreen } from "lucide-react";
import { motion } from "framer-motion";

import { Card } from "@/components/shadcn/card";

export default function IntroPage() {
  const router = useRouter();

  const cards = [
    {
      title: "전력 시장",
      description: "전력 시장 현황 및 분석",
      icon: <BarChart3 className="h-6 w-6" />,
      path: "/introduce",
    },
    {
      title: "ESG 현황",
      description: "환경, 사회, 지배구조 정보",
      icon: <LeafyGreen className="h-6 w-6" />,
      path: "/introduce",
    },
    {
      title: "팀 소개",
      description: "WattsUp 팀 소개",
      icon: <Users className="h-6 w-6" />,
      path: "/introduce",
    },
  ];

  return (
    <div className="flex h-screen items-center justify-center p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-center text-4xl font-bold">전력 정보</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="hover:bg-accent group flex h-[200px] cursor-pointer flex-col items-center justify-center p-6 text-center transition-all hover:shadow-lg"
                onClick={() => router.push(card.path)}
              >
                <div className="flex flex-col items-center gap-4">
                  {card.icon}
                  <div>
                    <h2 className="text-xl font-semibold">{card.title}</h2>
                    <p className="text-muted-foreground text-sm">
                      {card.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="mt-4 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
