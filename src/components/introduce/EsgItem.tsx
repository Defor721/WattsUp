"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Globe, Heart, Building, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ESGItem = {
  title: string;
  icon: LucideIcon;
  color: string;
  description: string;
};

export const ESGItems = () => {
  const esgRef = useRef(null);

  const isESGInView = useInView(esgRef, { once: true, amount: 0.5 });

  const esgItems: ESGItem[] = [
    {
      title: "환경 (Environmental)",
      icon: Globe,
      color: "text-green-500",
      description:
        "우리는 신재생에너지 확대와 온실가스 감축을 통해 환경 보호를 실천합니다. " +
        "지속 가능한 전력시장을 구축하기 위해 친환경 기술과 설비를 도입하고 있습니다. " +
        "태양광, 풍력 등 재생 가능 에너지 자원을 적극 활용하여 탄소 배출을 줄입니다. " +
        "지구 환경을 보존하기 위해 에너지 전환을 가속화하고 있습니다.",
    },
    {
      title: "사회 (Social)",
      icon: Heart,
      color: "text-red-500",
      description:
        "사회적 가치를 실현하기 위해 공정하고 투명한 전력거래 문화를 조성합니다. " +
        "지역 사회와 협력하여 에너지 복지 증진과 공동체 지원 활동을 전개하고 있습니다. " +
        "모든 이해관계자와의 신뢰를 바탕으로 사회적 책임을 다하는 전력시장을 만듭니다. " +
        "다양성과 포용성을 존중하며 지속 가능한 사회를 구현하고 있습니다.",
    },
    {
      title: "지배구조 (Governance)",
      icon: Building,
      color: "text-blue-500",
      description:
        "투명하고 윤리적인 경영을 통해 이해관계자들과의 신뢰를 구축합니다. " +
        "효율적인 의사 결정과 책임 있는 경영 구조를 갖추어 기업의 지속 가능성을 보장합니다. " +
        "주주, 고객, 직원 간의 협력을 강화하여 상생의 문화를 조성하고 있습니다. " +
        "데이터 기반 경영으로 미래의 전력 시장을 준비합니다.",
    },
    {
      title: "WattsUp",
      icon: Star,
      color: "text-orange-500",
      description:
        "WattsUp은 혁신적인 에너지 솔루션으로 지속 가능한 미래를 창출합니다. " +
        "고객과의 협력을 통해 에너지 효율성을 극대화하고 전력 사용 비용을 절감합니다. " +
        "친환경 기술과 혁신을 바탕으로 차세대 에너지 생태계를 설계합니다. " +
        "미래 세대를 위한 지속 가능한 에너지 환경 구축에 기여하고 있습니다.",
    },
  ];

  const [selectedESGItem, setSelectedESGItem] = useState<string>(
    esgItems[0].title,
  );

  const handleESGItemClick = (title: string) => {
    setSelectedESGItem(title);
  };

  return (
    <motion.div
      ref={esgRef}
      className="flex w-full max-w-6xl flex-col items-center justify-between md:flex-row-reverse"
      initial={{ opacity: 0, y: 50 }}
      animate={isESGInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="mb-8 w-full md:mb-0 md:w-1/3">
        <h2 className="mb-6 text-center text-4xl font-bold text-gray-800 md:text-left">
          ESG 경영 활동
        </h2>
        <p className="mb-4 pb-8 text-center text-lg text-neutral-600 md:text-left">
          우리는 환경(Environmental), 사회(Social), 지배구조(Governance)를
          중심으로 한 ESG 경영을 통해 지속 가능한 미래를 만들어갑니다. WattsUp은
          이러한 ESG 가치를 실현하는 혁신적인 솔루션을 제공합니다.
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-4 rounded-md border-1 p-4 pt-4 text-sm text-gray-600"
        >
          <div className="flex flex-col">
            <div className="mb-2 font-bold">
              {esgItems.find((item) => item.title === selectedESGItem)?.title}
            </div>
            <div>
              {
                esgItems.find((item) => item.title === selectedESGItem)
                  ?.description
              }
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
