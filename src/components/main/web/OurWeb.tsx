"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Code,
  Lightbulb,
  Users,
  Rocket,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/shadcn/button";

// 타입 정의
interface TeamInfo {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ReasonInfo {
  title: string;
  content: string;
}

// 팀 정보 데이터
const teamInfo: TeamInfo[] = [
  {
    title: "WattsUp 팀",
    description: "혁신적인 전력 거래 플랫폼 개발",
    icon: <Zap />,
  },
  {
    title: "프론트엔드 전문가",
    description: "최신 웹 기술로 효율적인 UI 구현",
    icon: <Code />,
  },
  {
    title: "혁신적인 아이디어",
    description: "빅데이터와 AI로 미래 솔루션 제시",
    icon: <Lightbulb />,
  },
  {
    title: "협업의 힘",
    description: "다양한 기술로 시너지 창출",
    icon: <Users />,
  },
  {
    title: "미래를 향한 도전",
    description: "지속 가능한 에너지 거래 선도",
    icon: <Rocket />,
  },
];

// 선택 이유 데이터
const reasons: ReasonInfo[] = [
  {
    title: "에너지 산업의 디지털 전환",
    content:
      "전력거래소는 전력 시장의 중심으로, 디지털 전환이 에너지 효율성을 향상시키는 핵심 요소로 작용합니다.",
  },
  {
    title: "사용자 중심의 접근성 개선",
    content:
      "복잡한 기존 전력거래소 웹을 개선하여 누구나 쉽게 사용할 수 있는 사용자 친화적 인터페이스를 제공합니다.",
  },
  {
    title: "데이터 기반 혁신 가능성",
    content:
      "실시간 데이터 분석과 예측 모델을 통해 더 나은 의사결정을 지원하는 혁신적인 솔루션을 개발합니다.",
  },
  {
    title: "지속 가능한 에너지 관리",
    content:
      "신재생 에너지 자원을 통합하고 효율적인 에너지 소비를 가능하게 하는 플랫폼을 제공합니다.",
  },
  {
    title: "사회적 및 경제적 영향력",
    content:
      "에너지 비용 절감과 전력 공급 안정화는 물론, 환경 보호와 같은 사회적 책임도 실현합니다.",
  },
  {
    title: "안전하고 투명한 전력 거래",
    content:
      "블록체인 기술을 활용하여 전력 거래 과정의 투명성과 신뢰성을 높이고, 보안성을 강화합니다.",
  },
];

// 팀 정보 아이템 컴포넌트
const TeamInfoItem = ({ title, description, icon }: TeamInfo) => {
  const router = useRouter();

  return (
    <motion.div
      className="group flex cursor-pointer flex-col items-center text-center"
      whileHover={{ scale: 1.05 }}
      onClick={() => router.push("/introduce")}
    >
      <div className="mb-2 p-3">
        {React.cloneElement(icon as React.ReactElement, {
          className: "h-6 w-6 text-gray-300",
        })}
      </div>
      <h3 className="mb-1 text-lg font-semibold transition-colors group-hover:text-gray-500">
        {title}
      </h3>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  );
};

// 선택 이유 아이템 컴포넌트
const ReasonItem = ({ title, content }: ReasonInfo) => (
  <motion.div
    className="p-6 shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="mb-3 text-xl font-semibold">{title}</h3>
    <p className="text-gray-600">{content}</p>
  </motion.div>
);

// 메인 컴포넌트
export default function OurWeb() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  return (
    <AnimatePresence mode="sync">
      <motion.div
        layout
        className="flex min-h-screen flex-col items-center justify-center"
        transition={{ duration: 0.5 }}
      >
        {/* 팀 소개 섹션 */}
        <motion.section className="container mx-auto px-6" layout>
          <motion.div layout>
            <h1 className="mb-12 pb-4 text-center text-4xl font-bold">
              <span className="bg-gradient-to-r from-teal-200 to-blue-300 bg-clip-text text-transparent">
                WattsUp
              </span>{" "}
              팀 소개
            </h1>
            {/* 더 알아보기 버튼 추가 */}
            <div className="mb-16 flex justify-center">
              <Button
                onClick={() => router.push("/introduce")}
                variant="outline"
                className="group flex items-center gap-2 rounded-full px-6 py-4 text-base hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                더 알아보기
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            {/* 팀 정보 그리드 */}
            <div className="mb-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {teamInfo.map((info, index) => (
                <TeamInfoItem key={index} {...info} />
              ))}
            </div>

            {/* 확장 버튼 */}
            <div className="flex justify-center">
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                variant="ghost"
                className="group flex items-center gap-2 rounded-full px-8 py-2 text-lg"
              >
                <span className="font-semibold transition-colors group-hover:text-gray-500">
                  우리는 왜 전력거래소 웹을 선택했을까?
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </Button>
            </div>
          </motion.div>
        </motion.section>

        {/* 선택 이유 섹션 */}
        {isExpanded && (
          <motion.section
            className="container mx-auto px-6 py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {reasons.map((reason, index) => (
                <ReasonItem key={index} {...reason} />
              ))}
            </div>
          </motion.section>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
