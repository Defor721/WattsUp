"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

// InfoCardProps 타입 정의
interface InfoCardProps {
  Icon?: LucideIcon; // 선택적 아이콘 컴포넌트
  title: string; // 카드 제목
  description: string; // 카드 설명
  index: number; // 애니메이션 지연 시간 계산용 인덱스
}

// InfoCard 컴포넌트 정의
const InfoCard = ({ Icon, title, description, index }: InfoCardProps) => {
  return (
    <motion.div
      className="rounded-2xl bg-white/10 p-4 text-white backdrop-blur-md lg:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 * index }}
    >
      {/* 아이콘 */}
      {Icon && <Icon className="mb-4 h-8 w-8" />}{" "}
      {/* 아이콘이 있을 때만 렌더링 */}
      {/* 제목 */}
      <h3 className="mb-2 text-lg font-semibold lg:text-xl">{title}</h3>
      {/* 설명 */}
      <p className="text-sm text-white/80 lg:text-base">{description}</p>
    </motion.div>
  );
};

export default InfoCard; // InfoCard 컴포넌트 내보내기
