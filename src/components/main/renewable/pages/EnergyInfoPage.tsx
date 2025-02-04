"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import AnimatedTitle from "@/components/main/renewable/AnimatedTitle"; // 애니메이션 제목 컴포넌트
import AnimatedDescription from "@/components/main/renewable/AnimatedDescription"; // 애니메이션 설명 컴포넌트
import { infoCards } from "@/components/main/renewable/data/infoCards"; // 정보 카드 데이터 파일
import InfoCard from "@/components/main/renewable/InfoCard"; // 정보 카드 렌더링 컴포넌트

// EnergyInfoPage 컴포넌트
const EnergyInfoPage = () => {
  return (
    <div className="min-h-screen">
      {/* 메인 섹션 */}
      <section className="relative flex min-h-screen flex-col lg:flex-row">
        {/* 왼쪽: 텍스트 섹션 */}
        <div className="flex items-center bg-white p-6 dark:bg-subColor lg:w-1/2 lg:p-12">
          <div className="mx-auto max-w-xl lg:mx-0">
            {/* 애니메이션 제목 컴포넌트 */}
            <AnimatedTitle
              title="전력 거래소와"
              highlightedText="신재생 에너지"
            />
            {/* 애니메이션 설명 컴포넌트 */}
            <AnimatedDescription text="지속 가능한 미래를 위한 혁신적인 에너지 솔루션" />
          </div>
        </div>

        {/* 오른쪽: 정보 카드 섹션 */}
        <div className="relative overflow-hidden bg-blue-600 lg:w-1/2">
          {/* 배경 애니메이션 */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Image
              src="/assets/images/map.png"
              alt="Renewable Energy Visualization"
              fill
              className="object-cover opacity-50 mix-blend-overlay"
            />
          </motion.div>

          <div className="relative flex h-full items-center p-6 lg:p-12">
            {/* 정보 카드 그리드 */}
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-8">
              {/* infoCards 데이터 매핑 */}
              {infoCards.map((card, index) => (
                <InfoCard
                  Icon={undefined}
                  key={index} // 고유 키 설정
                  {...card} // 데이터 속성 전달
                  index={index} // 애니메이션 딜레이 시간 전달
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EnergyInfoPage; // 기본 내보내기
