"use client"; // Next.js에서 클라이언트 컴포넌트로 설정

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

type MarketEntity = {
  title: string; // 항목 제목
  color: string; // 항목 색상
  description: string; // 항목 설명
  position: { x: number; y: number }; // SVG에서 위치 좌표
};

export const PowerMarket = () => {
  const marketRef = useRef(null); // 섹션 참조를 위한 useRef
  const isMarketInView = useInView(marketRef, { once: true, amount: 0.5 }); // 뷰포트 안에 들어왔는지 확인

  // 전력시장 구성 요소 데이터
  const marketEntities: MarketEntity[] = [
    {
      title: "발전회사",
      color: "#3B82F6",
      description:
        "발전회사는 전력을 생산하여 전력시장에 공급하는 역할을 합니다. 이들은 화력, 원자력, 신재생에너지 등을 이용하여 전력을 생산합니다. 생산된 전력은 전력거래소를 통해 전력망에 전달되어 소비자에게 공급됩니다. 전력 생산의 안정성과 효율성은 국가 에너지 정책의 중요한 축입니다.",
      position: { x: -250, y: -250 },
    },
    {
      title: "한국전력거래소",
      color: "#EC4899",
      description:
        "한국전력거래소는 전력시장을 운영하며 전력거래를 중개하는 핵심 기관입니다. 발전회사와 전력 공급자 간의 전력 거래를 조정하고 최적의 전력 분배를 관리합니다. 공정하고 투명한 전력거래를 위해 시장 규칙을 제정하고 이를 시행합니다. 효율적인 전력 시스템 운영을 통해 전력 수급 안정성을 유지합니다.",
      position: { x: 250, y: -250 },
    },
    {
      title: "한국전력공사",
      color: "#10B981",
      description:
        "한국전력공사는 발전회사로부터 구매한 전력을 소비자에게 공급하는 국가 공기업입니다. 전력망을 관리하고 송배전 설비의 유지보수를 책임집니다. 신재생에너지 확대 및 에너지 절약 캠페인을 통해 친환경 경영을 실천하고 있습니다. 안정적인 전력 공급을 통해 국민 생활과 산업의 기반을 지원합니다.",
      position: { x: 250, y: 250 },
    },
    {
      title: "소비자",
      color: "#F59E0B",
      description:
        "소비자는 전력을 사용하는 개인 및 기업 고객을 말합니다. 가정, 상업, 산업 등 다양한 용도로 전력을 소비합니다. 최근에는 에너지 효율성을 높이기 위해 스마트 계량기와 같은 기술을 활용하고 있습니다. 소비자의 전력 사용 패턴은 전력시장의 수요와 공급을 결정하는 중요한 요소입니다.",
      position: { x: -250, y: 250 },
    },
  ];

  // 상태 관리: 선택된 항목, hover된 항목, 중앙 원 색상
  const [selectedMarketItem, setSelectedMarketItem] = useState<string>(
    marketEntities[0].title,
  );
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [centralColor, setCentralColor] = useState("#D3D3D3");

  return (
    <section className="flex flex-col items-center justify-center overflow-hidden px-4 py-24">
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
          <h2 className="mb-6 text-center text-3xl font-bold md:text-left md:text-4xl">
            전력시장 구조
          </h2>
          <p className="mb-4 pb-8 text-center text-lg text-neutral-600 dark:text-neutral-400 md:text-left">
            한국의 전력시장은 다양한 주체들의 상호작용으로 운영됩니다. 발전회사,
            한국전력거래소, 한국전력공사, 그리고 소비자가 핵심 구성원으로
            참여하고 있습니다.
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMarketItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-4 rounded-md border-2 p-4 text-base text-neutral-600 dark:text-neutral-400"
              style={{
                borderColor:
                  marketEntities.find(
                    (item) => item.title === selectedMarketItem,
                  )?.color || "#D3D3D3",
              }}
            >
              <motion.div className="flex flex-col">
                <motion.div className="mb-2 text-lg font-bold">
                  {selectedMarketItem}
                </motion.div>
                <motion.div>
                  {
                    marketEntities.find(
                      (item) => item.title === selectedMarketItem,
                    )?.description
                  }
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="relative h-[600px] w-full md:w-2/3">
          <svg className="h-full w-full" viewBox="-350 -350 700 700">
            {/* 연결선 */}
            {marketEntities.map((item) => (
              <motion.line
                key={`line-${item.title}`}
                x1="0"
                y1="0"
                x2={item.position.x}
                y2={item.position.y}
                stroke={hoveredItem === item.title ? item.color : "#D3D3D3"}
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            ))}
            {/* 중앙 원 */}
            <motion.circle
              r="90"
              cx="0"
              cy="0"
              fill="white"
              stroke={centralColor}
              strokeWidth="2"
              className="fill-white dark:fill-[rgb(15,30,75)]"
            />
            <motion.text
              x="0"
              y="0"
              textAnchor="middle"
              dy=".3em"
              fill={centralColor}
              className="text-3xl font-bold"
            >
              전력시장
            </motion.text>

            {/* 시장 구조 아이템 */}
            {marketEntities.map((item, index) => (
              <motion.g
                key={item.title}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                onClick={() => {
                  setSelectedMarketItem(item.title);
                  setCentralColor(item.color);
                }}
                onMouseEnter={() => {
                  setHoveredItem(item.title);
                  setCentralColor(item.color);
                }}
                onMouseLeave={() => {
                  setHoveredItem(null);
                  setCentralColor(
                    marketEntities.find((i) => i.title === selectedMarketItem)
                      ?.color || "#D3D3D3",
                  );
                }}
                className="cursor-pointer"
              >
                {/* 주변원 */}
                <motion.circle
                  r="70"
                  cx={item.position.x}
                  cy={item.position.y}
                  fill={item.color}
                  whileHover={{ scale: 1.1 }}
                />
                <motion.text
                  x={item.position.x}
                  y={item.position.y}
                  textAnchor="middle"
                  dy=".3em"
                  className="fill-white text-lg font-medium"
                >
                  {item.title}
                </motion.text>
              </motion.g>
            ))}
          </svg>
        </div>
      </motion.div>
    </section>
  );
};
