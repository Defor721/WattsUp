"use client"; // 클라이언트 컴포넌트임을 선언. 서버 컴포넌트와 구분하기 위함

import { useState, useCallback } from "react"; // 상태 관리와 메모이제이션을 위한 React 훅 import
import { motion } from "framer-motion"; // 애니메이션 라이브러리 import
import { Zap, Code, Lightbulb, Users, Rocket, ChevronDown } from "lucide-react"; // 아이콘 컴포넌트 import
import { useRouter } from "next/navigation"; // Next.js의 라우팅 기능을 위한 useRouter 훅 import
import clsx from "clsx"; // 조건부 클래스 관리를 위한 라이브러리 import

import { Button } from "@/components/ui/button"; // Button 컴포넌트 import
import {
  // Tooltip 관련 컴포넌트 import
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";

// Info 타입 정의. 각 정보는 제목, 설명, 아이콘(optional)을 포함
interface Info {
  title: string; // 제목
  description: string; // 설명
  icon?: React.ReactNode; // 아이콘 (선택적)
}

// 팀 정보 데이터 배열 정의
const teamInfo: Info[] = [
  {
    title: "WattsUp 팀", // 첫 번째 항목의 제목
    description: "혁신적인 전력 거래 플랫폼 개발", // 첫 번째 항목의 설명
    icon: <Zap className="h-6 w-6 text-primary" />, // Zap 아이콘 사용
  },
  {
    title: "프론트엔드 전문가",
    description: "최신 웹 기술로 효율적인 UI 구현",
    icon: <Code className="h-6 w-6 text-primary" />, // Code 아이콘 사용
  },
  {
    title: "혁신적인 아이디어",
    description: "빅데이터와 AI로 미래 솔루션 제시",
    icon: <Lightbulb className="h-6 w-6 text-primary" />, // Lightbulb 아이콘 사용
  },
  {
    title: "협업의 힘",
    description: "다양한 기술로 시너지 창출",
    icon: <Users className="h-6 w-6 text-primary" />, // Users 아이콘 사용
  },
  {
    title: "미래를 향한 도전",
    description: "지속 가능한 에너지 거래 선도",
    icon: <Rocket className="h-6 w-6 text-primary" />, // Rocket 아이콘 사용
  },
];

// 선택 이유 데이터 배열 정의
const reasons: Info[] = [
  {
    title: "에너지 산업의 디지털 전환",
    description: "디지털 전환으로 효율성 향상",
  },
  {
    title: "사용자 중심 접근성 개선",
    description: "사용자 친화적 인터페이스 제공",
  },
  {
    title: "데이터 기반 혁신 가능성",
    description: "실시간 데이터 분석으로 의사결정 지원",
  },
  {
    title: "지속 가능한 에너지 관리",
    description: "효율적 에너지 소비 지원",
  },
  {
    title: "사회적 및 경제적 영향력",
    description: "비용 절감 및 환경 보호",
  },
  {
    title: "안전하고 투명한 전력 거래",
    description: "블록체인으로 투명성과 보안성 강화",
  },
];

// InfoItem 컴포넌트 정의
const InfoItem = ({ title, description, icon }: Info) => (
  <motion.div
    className="group rounded-lg p-4 transition-all hover:shadow-md dark:hover:border-gray-700" // Tailwind 스타일 클래스 설정
    whileHover={{ scale: 1.05 }} // hover 시 크기를 1.05배 확대하는 애니메이션 효과
  >
    <div className="flex items-center gap-2">
      {/* 아이콘과 제목을 가로로 배치 */}
      <div className="text-gray-300 dark:hover:text-red-600">{icon}</div>
      {/* 아이콘 표시 */}
      <h3 className="text-lg font-semibold">{title}</h3> {/* 제목 표시 */}
    </div>
    <p className="mt-2 text-sm">{description}</p> {/* 설명 표시 */}
  </motion.div>
);

// ReasonItem 컴포넌트 정의
const ReasonItem = ({ title, description }: Info) => (
  <TooltipProvider>
    {/* Tooltip을 제공하는 컨텍스트 */}
    <Tooltip>
      <TooltipTrigger asChild>
        {/* Tooltip을 트리거하는 요소 설정 */}
        <motion.div className="cursor-pointer rounded-lg p-2 hover:text-primary">
          {/* 텍스트에 hover 효과 적용 */}
          <h3 className="text-lg font-semibold">{title}</h3> {/* 제목 표시 */}
        </motion.div>
      </TooltipTrigger>
      <TooltipContent>
        {/* Tooltip의 내용 */}
        <p className="max-w-xs text-sm">{description}</p> {/* 설명 표시 */}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// OurWeb 컴포넌트 정의
const OurWeb = () => {
  const [isExpanded, setIsExpanded] = useState(false); // 섹션 확장 여부를 관리하는 상태
  const router = useRouter(); // Next.js 라우터 훅 사용

  // 섹션 확장/축소를 토글하는 함수
  const toggleExpanded = useCallback(() => setIsExpanded((prev) => !prev), []);

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-gray-900" // 레이아웃 및 스타일 설정
      initial={{ opacity: 0 }} // 초기 투명도 설정
      animate={{ opacity: 1 }} // 애니메이션 후 투명도를 1로 변경
      transition={{ duration: 0.5 }} // 애니메이션 지속 시간 설정
    >
      <motion.section className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 컨테이너 */}
        <motion.h1
          className="mb-8 text-center text-2xl font-bold sm:text-4xl" // 제목 스타일 설정
          initial={{ y: -50 }} // 초기 y축 위치 설정
          animate={{ y: 0 }} // y축 위치를 0으로 애니메이션
          transition={{ type: "spring", stiffness: 100 }} // 스프링 애니메이션 설정
        >
          <span className="bg-gradient-to-r from-teal-200 to-blue-300 bg-clip-text text-transparent">
            WattsUp
          </span>
          팀 소개
        </motion.h1>
        <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {/* 팀 정보 그리드 */}
          {teamInfo.map((info, index) => (
            <InfoItem key={index} {...info} /> // 각 팀 정보를 InfoItem 컴포넌트로 렌더링
          ))}
        </motion.div>
        <motion.div className="mt-8 flex justify-center">
          {/* 버튼 컨테이너 */}
          <Button
            onClick={() => router.push("/introduce")} // 버튼 클릭 시 경로 이동
            variant="outline"
            className="group flex items-center gap-2 rounded-full px-6 py-4 text-base" // 버튼 스타일
          >
            더 알아보기 {/* 버튼 텍스트 */}
            <ChevronDown className="ml-2 transition-transform group-hover:rotate-180" />
            {/* 화살표 아이콘 */}
          </Button>
        </motion.div>
        {isExpanded && ( // isExpanded 상태에 따라 렌더링
          <motion.section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason, index) => (
              <ReasonItem key={index} {...reason} /> // 각 이유를 ReasonItem 컴포넌트로 렌더링
            ))}
          </motion.section>
        )}
      </motion.section>
    </motion.div>
  );
};

export default OurWeb; // 컴포넌트 export
