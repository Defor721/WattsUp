"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Zap,
  Factory,
  DollarSign,
  Users,
  Globe,
  Heart,
  Building,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type MarketEntity = {
  title: string;
  icon: LucideIcon;
  color: string;
  description: string;
};

type ESGItem = {
  title: string;
  icon: LucideIcon;
  color: string;
  description: string;
  style?: React.CSSProperties;
};

export const PowerMarket = () => {
  const marketRef = useRef(null);

  const isMarketInView = useInView(marketRef, { once: true, amount: 0.5 });

  const marketEntities: MarketEntity[] = [
    {
      title: "발전회사",
      icon: Zap,
      color: "text-yellow-500",
      description:
        "발전회사는 전력을 생산하여 전력시장에 공급하는 역할을 합니다. " +
        "이들은 화력, 원자력, 신재생에너지 등을 이용하여 전력을 생산합니다. " +
        "생산된 전력은 전력거래소를 통해 전력망에 전달되어 소비자에게 공급됩니다. " +
        "전력 생산의 안정성과 효율성은 국가 에너지 정책의 중요한 축입니다.",
    },
    {
      title: "한국전력거래소",
      icon: DollarSign,
      color: "text-blue-500",
      description:
        "한국전력거래소는 전력시장을 운영하며 전력거래를 중개하는 핵심 기관입니다. " +
        "발전회사와 전력 공급자 간의 전력 거래를 조정하고 최적의 전력 분배를 관리합니다. " +
        "공정하고 투명한 전력거래를 위해 시장 규칙을 제정하고 이를 시행합니다. " +
        "효율적인 전력 시스템 운영을 통해 전력 수급 안정성을 유지합니다.",
    },
    {
      title: "한국전력공사",
      icon: Factory,
      color: "text-green-500",
      description:
        "한국전력공사는 발전회사로부터 구매한 전력을 소비자에게 공급하는 국가 공기업입니다. " +
        "전력망을 관리하고 송배전 설비의 유지보수를 책임집니다. " +
        "신재생에너지 확대 및 에너지 절약 캠페인을 통해 친환경 경영을 실천하고 있습니다. " +
        "안정적인 전력 공급을 통해 국민 생활과 산업의 기반을 지원합니다.",
    },
    {
      title: "소비자",
      icon: Users,
      color: "text-purple-500",
      description:
        "소비자는 전력을 사용하는 개인 및 기업 고객을 말합니다. " +
        "가정, 상업, 산업 등 다양한 용도로 전력을 소비합니다. " +
        "최근에는 에너지 효율성을 높이기 위해 스마트 계량기와 같은 기술을 활용하고 있습니다. " +
        "소비자의 전력 사용 패턴은 전력시장의 수요와 공급을 결정하는 중요한 요소입니다.",
    },
  ];

  const [selectedMarketItem, setSelectedMarketItem] = useState<string>(
    marketEntities[0].title,
  );

  const handleMarketItemClick = (title: string) => {
    setSelectedMarketItem(title);
  };

  return (
    <section className="flex flex-col items-center justify-center overflow-hidden px-4 py-24">
      {/* 전력시장 구조 */}
      <motion.div
        ref={marketRef}
        className="flex w-full max-w-6xl flex-col items-center justify-between md:flex-row"
        initial={{ opacity: 0, y: 50 }}
        animate={isMarketInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="mb-8 w-full md:mb-0 md:w-1/3">
          <span className="text-md bg-gradient-to-r from-teal-200 to-blue-300 bg-clip-text font-bold text-transparent">
            WattsUp
          </span>
          <h2 className="mb-6 text-center text-4xl font-bold md:text-left">
            전력시장 구조
          </h2>
          <p className="mb-4 pb-8 text-center text-lg text-neutral-600 dark:text-neutral-400 md:text-left">
            한국의 전력시장은 다양한 주체들의 상호작용으로 운영됩니다. 발전회사,
            한국전력거래소, 한국전력공사, 그리고 소비자가 핵심 구성원으로
            참여하고 있습니다.
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }} // Transition 효과 추가
            className="mt-4 rounded-md border-1 p-4 pt-4 text-sm text-neutral-600 dark:text-neutral-400"
          >
            <div className="flex flex-col">
              {/* Title Hover 효과 추가 */}
              <motion.div
                className="mb-2 font-bold"
                initial={{ scale: 1 }} // 초기 상태
                transition={{ type: "spring", stiffness: 300, damping: 15 }} // 자연스러운 애니메이션
              >
                {
                  marketEntities.find(
                    (item) => item.title === selectedMarketItem,
                  )?.title
                }
              </motion.div>

              {/* Description Transition 효과 추가 */}
              <motion.div
                initial={{ opacity: 0 }} // 초기 상태
                animate={{ opacity: 1 }} // 애니메이션 상태
                transition={{ duration: 0.5, ease: "easeOut" }} // 부드러운 전환 효과
              >
                {
                  marketEntities.find(
                    (item) => item.title === selectedMarketItem,
                  )?.description
                }
              </motion.div>
            </div>
          </motion.div>
        </div>
        <div className="relative h-[500px] w-1/3 w-full pl-0 lg:w-2/3 lg:pl-24">
          <svg className="h-full w-full" viewBox="0 0 500 500">
            <g transform="translate(250, 250)">
              <circle
                r="60"
                fill="currentColor"
                className="text-transparent dark:text-transparent"
              />
              <text
                textAnchor="middle"
                dy=".3em"
                fontSize="20"
                fontWeight="bold"
                fill="currentColor"
                className="text-black dark:text-white"
              >
                전력시장
              </text>
            </g>

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
                    <circle
                      r="50"
                      fill="currentColor"
                      className="text-transparent dark:text-transparent"
                    />
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
                      <motion.g>
                        <entity.icon
                          className={`h-8 w-8 ${entity.color} cursor-pointer`}
                          x="-16"
                          y="-8"
                          onClick={() => handleMarketItemClick(entity.title)}
                        />
                      </motion.g>
                      <text
                        textAnchor="middle"
                        dy="2em"
                        fontSize="20"
                        fontWeight="bold"
                        fill="currentColor"
                        className="cursor-pointer text-black dark:text-white"
                        onClick={() => handleMarketItemClick(entity.title)}
                      >
                        {entity.title}
                      </text>
                    </motion.g>
                  </g>
                );
              })}
            </motion.g>
          </svg>
        </div>
      </motion.div>
    </section>
  );
};
