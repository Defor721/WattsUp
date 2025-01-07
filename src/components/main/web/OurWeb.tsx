"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Zap, Code, Lightbulb, Users, Rocket, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";

// 정보 타입 정의
interface Info {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

// 팀 정보 데이터
const teamInfo: Info[] = [
  {
    title: "WattsUp 팀",
    description: "혁신적인 전력 거래 플랫폼 개발",
    icon: (
      <Zap className="h-6 w-6 transition-colors group-hover:text-[rgb(15,30,75)]" />
    ),
  },
  {
    title: "프론트엔드 전문가",
    description: "최신 웹 기술로 효율적인 UI 구현",
    icon: (
      <Code className="h-6 w-6 transition-colors group-hover:text-[rgb(15,30,75)]" />
    ),
  },
  {
    title: "혁신적인 아이디어",
    description: "빅데이터와 AI로 미래 솔루션 제시",
    icon: (
      <Lightbulb className="h-6 w-6 transition-colors group-hover:text-[rgb(15,30,75)]" />
    ),
  },
  {
    title: "협업의 힘",
    description: "다양한 기술로 시너지 창출",
    icon: (
      <Users className="h-6 w-6 transition-colors group-hover:text-[rgb(15,30,75)]" />
    ),
  },
  {
    title: "미래를 향한 도전",
    description: "지속 가능한 에너지 거래 선도",
    icon: (
      <Rocket className="h-6 w-6 transition-colors group-hover:text-[rgb(15,30,75)]" />
    ),
  },
];

// 선택 이유 데이터
const reasons: Info[] = [
  {
    title: "에너지 산업의 디지털 전환",
    description:
      "전력거래소는 전력 시장의 중심으로, 디지털 전환이 에너지 효율성을 향상시키는 핵심 요소로 작용함.",
  },
  {
    title: "사용자 중심의 접근성 개선",
    description:
      "복잡한 기존 전력거래소 웹을 개선하여 누구나 쉽게 사용할 수 있는 사용자 친화적 인터페이스를 제공함.",
  },
  {
    title: "데이터 기반 혁신 가능성",
    description:
      "실시간 데이터 분석과 예측 모델을 통해 더 나은 의사결정을 지원하는 혁신적인 솔루션을 개발함.",
  },
  {
    title: "지속 가능한 에너지 관리",
    description:
      "신재생 에너지 자원을 통합하고 효율적인 에너지 소비를 가능하게 하는 플랫폼을 제공함.",
  },
  {
    title: "사회적 및 경제적 영향력",
    description:
      "에너지 비용 절감과 전력 공급 안정화는 물론, 환경 보호와 같은 사회적 책임도 실현함.",
  },
  {
    title: "안전하고 투명한 전력 거래",
    description:
      "블록체인 기술을 활용하여 전력 거래 과정의 투명성과 신뢰성을 높이고, 보안성을 강화함.",
  },
];

// InfoItem 컴포넌트
const InfoItem = ({ title, description, icon }: Info) => {
  const router = useRouter();

  return (
    <motion.div
      className="group cursor-pointer rounded-lg p-4 transition-all duration-300 hover:border hover:border-gray-200 hover:shadow-md"
      whileHover={{ scale: 1.05 }}
      onClick={() => router.push("/introduce")}
    >
      <div className="flex items-center gap-2">
        <div className="text-gray-300">{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </motion.div>
  );
};

// ReasonItem 컴포넌트
const ReasonItem = ({ title, description }: Info) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div className="cursor-pointer rounded-lg p-2 transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-400 transition-colors duration-300 hover:text-gray-800">
              {title}
            </h3>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// OurWeb 컴포넌트
const OurWeb = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTextHighlighted, setIsTextHighlighted] = useState(false);
  const router = useRouter();

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
    setIsTextHighlighted((prev) => !prev);
  }, []);

  const teamInfoItems = useMemo(
    () =>
      teamInfo.map((info, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <InfoItem {...info} />
        </motion.div>
      )),
    [],
  );

  const reasonItems = useMemo(
    () =>
      reasons.map((reason, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="text-center"
        >
          <ReasonItem {...reason} />
        </motion.div>
      )),
    [],
  );

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.section className="container mx-auto px-6">
        <motion.h1
          className="mb-12 pb-4 text-center text-4xl font-bold"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <span className="bg-gradient-to-r from-teal-200 to-blue-300 bg-clip-text text-transparent">
            WattsUp
          </span>{" "}
          팀 소개
        </motion.h1>

        <motion.div
          className="mb-16 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={() => {
              toggleExpanded();
              if (!isExpanded) {
                setTimeout(() => {
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  });
                }, 100);
              }
            }}
            variant="outline"
            className="group flex items-center gap-2 rounded-full px-6 py-4 text-base hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            더 알아보기
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </motion.svg>
          </Button>
        </motion.div>

        <motion.div
          className="mb-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, staggerChildren: 0.1 }}
        >
          {teamInfoItems}
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={toggleExpanded}
            variant="ghost"
            className="group flex items-center gap-2 rounded-full px-8 py-2 text-lg"
          >
            <span
              className={`font-semibold transition-colors ${
                isTextHighlighted
                  ? "text-gray-400"
                  : "text-gray-800 hover:text-gray-600 focus:text-gray-600 active:text-gray-600"
              }`}
            >
              우리는 왜 전력거래소 웹을 선택했을까?
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </Button>
        </motion.div>
      </motion.section>

      <motion.section
        className="container mx-auto overflow-hidden px-6"
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isExpanded ? 1 : 0,
          height: isExpanded ? "auto" : 0,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <motion.div
          className="grid gap-8 py-16 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isExpanded ? 1 : 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {reasonItems}
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default OurWeb;
