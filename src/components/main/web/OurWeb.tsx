"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Code,
  Lightbulb,
  Users,
  Rocket,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

// 정보 타입 정의
interface Info {
  title: string; // 제목
  description: string; // 설명
  icon?: React.ReactNode; // 아이콘 (선택 사항)
}

// 팀 정보 데이터
const teamInfo: Info[] = [
  {
    title: "WattsUp 팀",
    description: "혁신적인 전력 거래 플랫폼 개발",
    icon: (
      <Zap className="h-6 w-6 transition-colors group-hover:text-yellow-300" />
    ),
  },
  {
    title: "프론트엔드 전문가",
    description: "최신 웹 기술로 효율적인 UI 구현",
    icon: (
      <Code className="h-6 w-6 transition-colors group-hover:text-yellow-300" />
    ),
  },
  {
    title: "혁신적인 아이디어",
    description: "빅데이터와 AI로 미래 솔루션 제시",
    icon: (
      <Lightbulb className="h-6 w-6 transition-colors group-hover:text-yellow-300" />
    ),
  },
  {
    title: "협업의 힘",
    description: "다양한 기술로 시너지 창출",
    icon: (
      <Users className="h-6 w-6 transition-colors group-hover:text-yellow-300" />
    ),
  },
  {
    title: "미래를 향한 도전",
    description: "지속 가능한 에너지 거래 선도",
    icon: (
      <Rocket className="h-6 w-6 transition-colors group-hover:text-yellow-300" />
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
];

// InfoItem 컴포넌트
const InfoItem = ({ title, description, icon }: Info) => {
  const router = useRouter();

  return (
    <motion.div
      className="group cursor-pointer rounded-lg p-4 transition-all duration-300 hover:shadow-lg"
      whileHover={{ scale: 1.05 }}
      style={{ transformOrigin: "center" }}
      onClick={() => router.push("/introduce")}
    >
      <div className="flex flex-col items-center gap-2">
        {/* 아이콘 */}
        <div className="text-gray-300">{icon}</div>
        {/* 가운데 정렬된 제목 */}
        <h3 className="text-center text-lg font-semibold">{title}</h3>
        {/* 설명 중앙 정렬 */}
        <p className="mt-2 text-center text-sm text-slate-200 dark:text-gray-400">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// ReasonItem 컴포넌트
const ReasonItem = ({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) => {
  return (
    <motion.div
      className="relative cursor-pointer rounded-lg p-2 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold text-gray-400 transition-colors duration-300 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-300">
        {title}
      </h3>
      {/* 화살표 아이콘 */}
      <motion.div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </motion.div>
    </motion.div>
  );
};

// OurWeb 컴포넌트
const OurWeb = () => {
  const [selectedReason, setSelectedReason] = useState<Info | null>(null); // 선택된 이유 데이터 저장
  const router = useRouter();

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
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <ReasonItem
            title={reason.title}
            onClick={() => setSelectedReason(reason)}
          />
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
      {/* 상단 소개 섹션 */}
      <motion.section className="w-full bg-slate-800 py-12 text-white">
        <motion.h1
          className="mb-8 text-center text-4xl font-bold"
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
          className="mb-8 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={() => router.push("/introduce")}
            variant="outline"
            className="group flex items-center gap-2 rounded-full px-6 py-4 text-base hover:bg-slate-600 dark:hover:bg-gray-800"
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
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, staggerChildren: 0.1 }}
        >
          {teamInfoItems}
        </motion.div>
      </motion.section>

      {/* 중간에 위치한 텍스트 */}
      <motion.section className="w-full">
        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {/* 고정된 빈 박스에 description 표시 */}
          <div className="relative mx-auto mt-4 flex min-h-[140px] w-3/4 max-w-md items-center justify-center overflow-hidden rounded-md bg-gray-100 p-4 pt-4 dark:bg-gray-700">
            <AnimatePresence mode="wait">
              {selectedReason ? (
                <motion.div
                  key={selectedReason.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <p className="py-0 text-center text-sm text-gray-400 dark:text-gray-500">
                    &gt; 우리는 왜 전력거래소 웹을 선택했을까?
                  </p>
                  <h3 className="text-lg font-semibold">
                    {selectedReason.title}
                  </h3>
                  <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                    {selectedReason.description}
                  </p>
                </motion.div>
              ) : (
                <p className="text-lg text-gray-400 dark:text-gray-500">
                  우리는 왜 전력거래소 웹을 선택했을까?
                </p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          className="grid gap-8 py-8 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {reasonItems}
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default OurWeb;
