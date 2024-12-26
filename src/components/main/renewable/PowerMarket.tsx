"use client";

import React, { useRef } from "react";
import { color, motion, useInView } from "framer-motion";
import {
  Zap,
  Factory,
  DollarSign,
  Users,
  Globe,
  Heart,
  Building,
  Lightbulb,
  Wind,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

// MarketEntity 타입 정의
type MarketEntity = {
  title: string;
  icon: LucideIcon;
  color: string;
};

// ESGItem 타입 정의
type ESGItem = {
  title: string;
  icon: LucideIcon;
  color: string;
  description: string;
  style?: React.CSSProperties;
};

export const PowerMarketStructure = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const marketEntities: MarketEntity[] = [
    { title: "발전회사", icon: Zap, color: "text-yellow-500" },
    { title: "한국전력거래소", icon: DollarSign, color: "text-blue-500" },
    { title: "한국전력공사", icon: Factory, color: "text-green-500" },
    { title: "소비자", icon: Users, color: "text-purple-500" },
  ];

  const esgItems: ESGItem[] = [
    {
      title: "환경 (Environmental)",
      icon: Globe,
      color: "text-green-500",
      description:
        "신재생에너지 확대 및 온실가스 감축을 통한 친환경 전력시장 조성",
    },
    {
      title: "사회 (Social)",
      icon: Heart,
      color: "text-red-500",
      description: "공정하고 투명한 전력거래 문화 조성 및 사회적 가치 실현",
    },
    {
      title: "지배구조 (Governance)",
      icon: Building,
      color: "text-blue-500",
      description:
        "윤리경영 강화 및 이해관계자와의 소통을 통한 투명한 기업 운영",
    },
    {
      title: "WattsUp",
      icon: Wind,
      color: "text-orange-500",
      description: "혁신적인 에너지 솔루션으로 지속 가능한 미래 창출",
    },
  ];

  return (
    <section
      ref={ref}
      className="flex flex-col items-center justify-center gap-16 overflow-hidden bg-white px-4 py-24"
    >
      {/* 전력시장 구조 */}
      <div className="flex w-full max-w-6xl flex-col items-center justify-between md:flex-row">
        <motion.div
          className="mb-8 w-full md:mb-0 md:w-1/3"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-6 text-center text-4xl font-bold text-gray-800 md:text-left">
            전력시장 구조
          </h2>
          <p className="mb-4 text-center text-lg text-neutral-600 md:text-left">
            한국의 전력시장은 다양한 주체들의 상호작용으로 운영됩니다. 발전회사,
            한국전력거래소, 한국전력공사, 그리고 소비자가 핵심 구성원으로
            참여하고 있습니다.
          </p>
        </motion.div>
        <motion.div
          className="relative h-[500px] w-full md:w-2/3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <svg className="h-full w-full" viewBox="0 0 500 500">
            {/* 중앙 노드 */}
            <g transform="translate(250, 250)">
              <circle r="60" fill="#f0f0f0" />
              <text
                textAnchor="middle"
                dy=".3em"
                fontSize="18"
                fontWeight="bold"
                fill="#333"
              >
                전력시장
              </text>
            </g>

            {/* 회전하는 엔티티 그룹 */}
            <motion.g
              animate={{
                rotate: 360,
              }}
              transition={{
                repeat: Infinity,
                duration: 40,
                ease: "linear",
              }}
              style={{ transformOrigin: "250px 250px" }}
            >
              {marketEntities.map((entity, index) => {
                const angle = (index * 2 * Math.PI) / 4;
                const x = 250 + Math.cos(angle) * 170;
                const y = 250 + Math.sin(angle) * 170;

                return (
                  <g key={index} transform={`translate(${x}, ${y})`}>
                    <circle r="50" fill="#fff" />
                    <motion.g
                      animate={{
                        rotate: -360,
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 40,
                        ease: "linear",
                      }}
                    >
                      <entity.icon
                        className={`h-8 w-8 ${entity.color}`}
                        x="-16"
                        y="-16"
                      />
                      <text
                        textAnchor="middle"
                        dy="2em"
                        fontSize="16"
                        fontWeight="bold"
                        fill="#333"
                      >
                        {entity.title}
                      </text>
                    </motion.g>
                  </g>
                );
              })}
            </motion.g>
          </svg>
        </motion.div>
      </div>

      {/* ESG 경영 활동 */}
      <div className="flex w-full max-w-6xl flex-col items-center justify-between md:flex-row-reverse">
        <motion.div
          className="mb-8 w-full md:mb-0 md:w-1/3"
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-6 text-center text-4xl font-bold text-gray-800 md:text-left">
            ESG 경영 활동
          </h2>
          <p className="mb-4 text-center text-lg text-neutral-600 md:text-left">
            우리는 환경(Environmental), 사회(Social), 지배구조(Governance)를
            중심으로 한 ESG 경영을 통해 지속 가능한 미래를 만들어갑니다.
            WattsUp은 이러한 ESG 가치를 실현하는 혁신적인 솔루션을 제공합니다.
          </p>
        </motion.div>
        <motion.div
          className="relative h-[600px] w-full md:w-2/3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <svg className="h-full w-full" viewBox="0 0 600 600">
            {/* 중앙 노드 */}
            <g transform="translate(300, 300)">
              <circle r="60" fill="#f0f0f0" />
              <text
                textAnchor="middle"
                dy=".3em"
                fontSize="18"
                fontWeight="bold"
                fill="#333"
              >
                ESG
              </text>
            </g>

            {/* 회전하는 ESG 항목 그룹 */}
            <motion.g
              animate={{
                rotate: 360,
              }}
              transition={{
                repeat: Infinity,
                duration: 60,
                ease: "linear",
              }}
              style={{ transformOrigin: "300px 300px" }}
            >
              {esgItems.map((item, index) => {
                const angle = (index * 2 * Math.PI) / 4;
                const x = 300 + Math.cos(angle) * 190;
                const y = 300 + Math.sin(angle) * 190;

                return (
                  <g key={index} transform={`translate(${x}, ${y})`}>
                    <circle r="80" fill="white" />
                    <motion.g
                      animate={{
                        rotate: -360,
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 60,
                        ease: "linear",
                      }}
                    >
                      <item.icon
                        className={`h-10 w-10 ${item.color}`}
                        x="-20"
                        y="-40"
                      />
                      <text
                        textAnchor="middle"
                        fontSize="16"
                        fontWeight="bold"
                        fill="#333"
                        x="0"
                        y="10"
                        style={item.style}
                      >
                        {item.title}
                      </text>
                      <text
                        textAnchor="middle"
                        fontSize="10"
                        fill="#666"
                        x="0"
                        y="30"
                        width="140"
                      >
                        <tspan x="0" dy="0">
                          {item.description.split(" ").slice(0, 4).join(" ")}
                        </tspan>
                        <tspan x="0" dy="12">
                          {item.description.split(" ").slice(4, 8).join(" ")}
                        </tspan>
                        <tspan x="0" dy="12">
                          {item.description.split(" ").slice(8).join(" ")}
                        </tspan>
                      </text>
                    </motion.g>
                  </g>
                );
              })}
            </motion.g>
          </svg>
        </motion.div>
      </div>
    </section>
  );
};
