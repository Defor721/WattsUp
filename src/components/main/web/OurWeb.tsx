// Next.js에서 클라이언트 컴포넌트를 명시적으로 선언하기 위해 사용

import React, { useState } from "react"; // React 및 useState 훅 임포트
import { motion, AnimatePresence } from "framer-motion"; // 애니메이션 효과를 위한 Framer Motion 임포트
import {
  Zap,
  Code,
  Lightbulb,
  Users,
  Rocket,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react"; // 아이콘 컴포넌트 임포트
import { useRouter } from "next/navigation"; // Next.js의 라우터 훅

import { Button } from "@/components/shadcn/button"; // 커스텀 버튼 컴포넌트 임포트

// 타입 정의
interface Info {
  title: string; // 아이템 제목
  description: string; // 아이템 설명
  icon?: React.ReactNode; // 아이템 아이콘 (선택적)
}

// 팀 정보 데이터 배열
const teamInfo: Info[] = [
  {
    title: "WattsUp 팀",
    description: "혁신적인 전력 거래 플랫폼 개발",
    icon: <Zap className="h-6 w-6 text-gray-300" />, // Zap 아이콘
  },
  {
    title: "프론트엔드 전문가",
    description: "최신 웹 기술로 효율적인 UI 구현",
    icon: <Code className="h-6 w-6 text-gray-300" />, // Code 아이콘
  },
  {
    title: "혁신적인 아이디어",
    description: "빅데이터와 AI로 미래 솔루션 제시",
    icon: <Lightbulb className="h-6 w-6 text-gray-300" />, // Lightbulb 아이콘
  },
  {
    title: "협업의 힘",
    description: "다양한 기술로 시너지 창출",
    icon: <Users className="h-6 w-6 text-gray-300" />, // Users 아이콘
  },
  {
    title: "미래를 향한 도전",
    description: "지속 가능한 에너지 거래 선도",
    icon: <Rocket className="h-6 w-6 text-gray-300" />, // Rocket 아이콘
  },
];

// 선택 이유 데이터 배열
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

// 공통 아이템 컴포넌트
const InfoItem = ({
  title,
  description,
  icon,
  onClick,
}: Info & { onClick?: () => void }) => (
  <motion.div
    className="group flex cursor-pointer flex-col items-center text-center"
    whileHover={{ scale: 1.05 }} // hover 시 크기 확대
    onClick={onClick} // 클릭 이벤트
  >
    {icon && <div className="mb-2 p-3">{icon}</div>} {/* 아이콘 렌더링 */}
    <h3 className="mb-1 text-lg font-semibold transition-colors group-hover:text-gray-500">
      {title}
    </h3>{" "}
    {/* 제목 */}
    <p className="text-sm text-gray-600">{description}</p> {/* 설명 */}
  </motion.div>
);

// 메인 컴포넌트
function OurWeb() {
  const [isExpanded, setIsExpanded] = useState(false); // 확장 상태 관리
  const router = useRouter(); // 라우터 훅

  return (
    <AnimatePresence mode="sync">
      {" "}
      {/* 동기화된 애니메이션 */}
      <motion.div
        layout
        className="flex min-h-screen flex-col items-center justify-center"
        transition={{ duration: 0.5 }} // 애니메이션 지속 시간
      >
        <motion.section className="container mx-auto px-6" layout>
          <motion.div layout>
            {/* 제목 */}
            <h1 className="mb-12 pb-4 text-center text-4xl font-bold">
              <span className="bg-gradient-to-r from-teal-200 to-blue-300 bg-clip-text text-transparent">
                WattsUp
              </span>{" "}
              팀 소개
            </h1>

            {/* 더 알아보기 버튼 */}
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
                <InfoItem
                  key={index} // 고유 키
                  {...info} // 아이템 데이터 전달
                  onClick={() => router.push("/introduce")} // 클릭 시 이동
                />
              ))}
            </div>

            {/* 확장 버튼 */}
            <div className="flex justify-center">
              <Button
                onClick={() => setIsExpanded(!isExpanded)} // 확장 상태 토글
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
            initial={{ opacity: 0 }} // 초기 상태
            animate={{ opacity: 1 }} // 애니메이션 상태
            exit={{ opacity: 0 }} // 종료 상태
            transition={{ duration: 0.3 }} // 애니메이션 지속 시간
          >
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {reasons.map((reason, index) => (
                <InfoItem key={index} {...reason} /> // 이유 데이터 렌더링
              ))}
            </div>
          </motion.section>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default OurWeb; // 메인 컴포넌트 내보내기
