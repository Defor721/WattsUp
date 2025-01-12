"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

type ESGItem = {
  title: string;
  color: string;
  description: string;
  position: { x: number; y: number };
};

export const ESGItems = () => {
  const esgRef = useRef(null);
  const isESGInView = useInView(esgRef, { once: true, amount: 0.5 });

  const esgItems: ESGItem[] = [
    {
      title: "환경",
      color: "#3B82F6",
      description:
        "우리는 신재생에너지 확대와 온실가스 감축을 통해 환경 보호를 실천합니다. 기후변화에 적극 대응하며, 자원의 효율적 사용을 촉진합니다. 탄소 중립을 위해 지속적으로 혁신적인 기술을 도입하고 있습니다. 모두를 위한 지속 가능한 환경을 만드는 것이 우리의 목표입니다.",
      position: { x: -250, y: -250 },
    },
    {
      title: "사회",
      color: "#EC4899",
      description:
        "사회적 가치를 실현하기 위해 공정하고 투명한 전력거래 문화를 조성합니다. 다양한 사회적 책임 활동을 통해 지역사회의 발전에 기여하고 있습니다. 지속 가능한 경제 성장을 위해 지역 및 글로벌 커뮤니티와 협력합니다. 모든 이해관계자에게 공정한 기회를 제공합니다.",
      position: { x: 250, y: -250 },
    },
    {
      title: "지배구조",
      color: "#10B981",
      description:
        "투명하고 윤리적인 경영을 통해 이해관계자들과의 신뢰를 구축합니다. 효과적인 의사결정을 위해 독립적인 이사회를 운영하고 있습니다. 지속적인 내부 통제와 위험 관리를 통해 안정적인 비즈니스 환경을 유지합니다. 책임감 있는 경영 방침을 실천합니다.",
      position: { x: 250, y: 250 },
    },
    {
      title: "WattsUp",
      color: "#F59E0B",
      description:
        "WattsUp은 혁신적인 에너지 솔루션으로 지속 가능한 미래를 창출합니다. 첨단 기술을 활용하여 에너지 효율성을 극대화하며, 고객 맞춤형 서비스를 제공합니다. 지속 가능한 비즈니스 모델을 통해 사회적 가치를 창출합니다. 고객과 함께 환경 보호를 실현합니다.",
      position: { x: -250, y: 250 },
    },
  ];

  const [selectedESGItem, setSelectedESGItem] = useState<string>(
    esgItems[0].title,
  );
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [centralColor, setCentralColor] = useState("#D3D3D3");

  return (
    <section className="flex flex-col items-center justify-center overflow-hidden px-4 py-24">
      <motion.div
        ref={esgRef}
        className="flex w-full max-w-6xl flex-col items-center justify-between md:flex-row"
        initial={{ opacity: 0, y: 50 }}
        animate={isESGInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="mb-8 w-full md:mb-0 md:w-1/3">
          <span className="text-md bg-gradient-to-r from-teal-200 to-blue-300 bg-clip-text font-bold text-transparent">
            WattsUp
          </span>
          <h2 className="mb-6 text-center text-3xl font-bold md:text-left md:text-4xl">
            ESG 경영 활동
          </h2>
          <p className="mb-4 pb-8 text-center text-lg text-neutral-600 dark:text-neutral-400 md:text-left">
            우리는 환경(Environmental), 사회(Social), 지배구조(Governance)를
            중심으로 한 ESG 경영을 통해 지속 가능한 미래를 만들어갑니다.
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedESGItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-4 rounded-md border-2 p-4 text-base text-neutral-600 dark:text-neutral-400"
              style={{
                borderColor:
                  esgItems.find((item) => item.title === selectedESGItem)
                    ?.color || "#D3D3D3",
              }}
            >
              <motion.div className="flex flex-col">
                <motion.div className="mb-2 text-lg font-bold">
                  {selectedESGItem}
                </motion.div>
                <motion.div className="text-base">
                  {
                    esgItems.find((item) => item.title === selectedESGItem)
                      ?.description
                  }
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="relative h-[600px] w-full md:w-2/3">
          <svg className="h-full w-full" viewBox="-350 -350 700 700">
            {esgItems.map((item) => (
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
              ESG
            </motion.text>
            {esgItems.map((item, index) => (
              <motion.g
                key={item.title}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                onClick={() => {
                  setSelectedESGItem(item.title);
                  setCentralColor(item.color);
                }}
                onMouseEnter={() => {
                  setHoveredItem(item.title);
                  setCentralColor(item.color);
                }}
                onMouseLeave={() => {
                  setHoveredItem(null);
                  setCentralColor(
                    esgItems.find((i) => i.title === selectedESGItem)?.color ||
                      "#D3D3D3",
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
