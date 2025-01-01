"use client"; // Next.js에서 클라이언트 사이드 렌더링을 활성화하는 선언

import React, { useRef } from "react"; // React와 useRef 훅 가져오기
import { motion, useInView } from "framer-motion"; // 애니메이션 훅 및 컴포넌트
import {
  Zap,
  Factory,
  DollarSign,
  Users,
  Globe,
  Heart,
  Building,
  Star,
} from "lucide-react"; // Lucide-react에서 아이콘 가져오기
import type { LucideIcon } from "lucide-react"; // LucideIcon 타입 정의 가져오기

// MarketEntity 타입 정의: 전력시장 구성 요소를 정의
type MarketEntity = {
  title: string; // 구성 요소 이름
  icon: LucideIcon; // 아이콘 컴포넌트
  color: string; // Tailwind CSS 색상 클래스
};

// ESGItem 타입 정의: ESG 활동 항목을 정의
type ESGItem = {
  title: string; // 항목 이름
  icon: LucideIcon; // 아이콘 컴포넌트
  color: string; // Tailwind CSS 색상 클래스
  description: string; // 항목 설명
  style?: React.CSSProperties; // 선택적 스타일 정의
};

export const PowerMarketStructure = () => {
  const marketRef = useRef(null); // 전력시장 섹션의 DOM 참조를 위한 useRef
  const esgRef = useRef(null); // ESG 섹션의 DOM 참조를 위한 useRef

  const isMarketInView = useInView(marketRef, { once: true, amount: 0.5 }); // marketRef가 50% 화면에 보일 때 true
  const isESGInView = useInView(esgRef, { once: true, amount: 0.5 }); // esgRef가 50% 화면에 보일 때 true

  // 전력시장 구성 요소 배열
  const marketEntities: MarketEntity[] = [
    { title: "발전회사", icon: Zap, color: "text-yellow-500" }, // 발전회사의 데이터
    { title: "한국전력거래소", icon: DollarSign, color: "text-blue-500" }, // 한국전력거래소 데이터
    { title: "한국전력공사", icon: Factory, color: "text-green-500" }, // 한국전력공사의 데이터
    { title: "소비자", icon: Users, color: "text-purple-500" }, // 소비자 데이터를 포함
  ];

  // ESG 활동 항목 배열
  const esgItems: ESGItem[] = [
    {
      title: "환경 (Environmental)",
      icon: Globe,
      color: "text-green-500",
      description:
        "신재생에너지 확대 및 온실가스 감축을 통한 친환경 전력시장 조성", // ESG 항목 설명
    },
    {
      title: "사회 (Social)",
      icon: Heart,
      color: "text-red-500",
      description: "공정하고 투명한 전력거래 문화 조성 및 사회적 가치 실현", // 사회적 책임 강조
    },
    {
      title: "지배구조 (Governance)",
      icon: Building,
      color: "text-blue-500",
      description:
        "윤리경영 강화 및 이해관계자와의 소통을 통한 투명한 기업 운영", // 윤리경영과 관련된 설명
    },
    {
      title: "WattsUp",
      icon: Star,
      color: "text-orange-500",
      description: "혁신적인 에너지 솔루션으로 지속 가능한 미래 창출", // 프로젝트 설명
    },
  ];

  return (
    <section className="flex flex-col items-center justify-center gap-32 overflow-hidden bg-white px-4 py-24">
      {/* 전력시장 구조 */}
      <motion.div
        ref={marketRef} // 전력시장 섹션의 DOM 참조
        className="flex w-full max-w-6xl flex-col items-center justify-between md:flex-row"
        initial={{ opacity: 0, y: 50 }} // 초기 상태: 아래로 이동 & 투명
        animate={isMarketInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} // isMarketInView 상태에 따라 애니메이션
        transition={{ duration: 0.8, ease: "easeOut" }} // 애니메이션 지속 시간과 효과
      >
        <div className="mb-8 w-full md:mb-0 md:w-1/3">
          <h2 className="mb-6 text-center text-4xl font-bold text-gray-800 md:text-left">
            전력시장 구조
          </h2>
          <p className="mb-4 text-center text-lg text-neutral-600 md:text-left">
            한국의 전력시장은 다양한 주체들의 상호작용으로 운영됩니다. 발전회사,
            한국전력거래소, 한국전력공사, 그리고 소비자가 핵심 구성원으로
            참여하고 있습니다.
          </p>
        </div>
        <div className="relative h-[500px] w-full md:w-2/3">
          <svg className="h-full w-full" viewBox="0 0 500 500">
            {/* 중앙 노드 */}
            <g transform="translate(250, 250)">
              <circle r="60" fill="#f0f0f0" /> {/* 중앙 원 */}
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
                rotate: 360, // 360도 회전
              }}
              transition={{
                repeat: Infinity, // 무한 반복
                duration: 40, // 40초에 한 번 회전
                ease: "linear", // 일정한 속도
              }}
              style={{ transformOrigin: "250px 250px" }} // 회전 중심 설정
            >
              {marketEntities.map((entity, index) => {
                const angle = (index * 2 * Math.PI) / 4; // 위치 계산
                const x = 250 + Math.cos(angle) * 170; // x축 좌표 계산
                const y = 250 + Math.sin(angle) * 170; // y축 좌표 계산

                return (
                  <g key={index} transform={`translate(${x}, ${y})`}>
                    <circle r="50" fill="#fff" /> {/* 아이콘 배경 원 */}
                    <motion.g
                      animate={{
                        rotate: -360, // 개별 아이콘 반대 방향 회전
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 40,
                        ease: "linear",
                      }}
                    >
                      <entity.icon
                        className={`h-8 w-8 ${entity.color}`} // 아이콘 크기와 색상
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
        </div>
      </motion.div>

      {/* ESG 경영 활동 */}
      <motion.div
        ref={esgRef} // ESG 섹션 DOM 참조
        className="flex w-full max-w-6xl flex-col items-center justify-between md:flex-row-reverse"
        initial={{ opacity: 0, y: 50 }} // 초기 상태: 아래로 이동 & 투명
        animate={isESGInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} // isESGInView 상태에 따라 애니메이션
        transition={{ duration: 0.8, ease: "easeOut" }} // 애니메이션 지속 시간과 효과
      >
        <div className="mb-8 w-full md:mb-0 md:w-1/3">
          <h2 className="mb-6 text-center text-4xl font-bold text-gray-800 md:text-left">
            ESG 경영 활동
          </h2>
          <p className="mb-4 text-center text-lg text-neutral-600 md:text-left">
            우리는 환경(Environmental), 사회(Social), 지배구조(Governance)를
            중심으로 한 ESG 경영을 통해 지속 가능한 미래를 만들어갑니다.
            WattsUp은 이러한 ESG 가치를 실현하는 혁신적인 솔루션을 제공합니다.
          </p>
        </div>
        <div className="relative h-[600px] w-full md:w-2/3">
          <svg className="h-full w-full" viewBox="0 0 600 600">
            {/* 중앙 노드 */}
            <g transform="translate(300, 300)">
              <circle r="60" fill="#f0f0f0" /> {/* 중앙 원 */}
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
                rotate: 360, // 360도 회전
              }}
              transition={{
                repeat: Infinity, // 무한 반복
                duration: 60, // 60초에 한 번 회전
                ease: "linear", // 일정한 속도
              }}
              style={{ transformOrigin: "300px 300px" }} // 회전 중심 설정
            >
              {esgItems.map((item, index) => {
                const angle = (index * 2 * Math.PI) / 4; // 위치 계산
                const x = 300 + Math.cos(angle) * 190; // x축 좌표 계산
                const y = 300 + Math.sin(angle) * 190; // y축 좌표 계산

                return (
                  <g key={index} transform={`translate(${x}, ${y})`}>
                    <circle r="80" fill="white" /> {/* 아이콘 배경 원 */}
                    <motion.g
                      animate={{
                        rotate: -360, // 개별 아이콘 반대 방향 회전
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 60,
                        ease: "linear",
                      }}
                    >
                      <item.icon
                        className={`h-10 w-10 ${item.color}`} // 아이콘 크기와 색상
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
                        style={item.style} // 선택적 스타일
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
        </div>
      </motion.div>
    </section>
  );
};
