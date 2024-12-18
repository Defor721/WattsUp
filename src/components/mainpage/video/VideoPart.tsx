"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// 슬라이드 데이터 정의
const slides = [
  {
    title: "스마트 에너지 거래",
    subtitle: "전력 교환의 혁신",
    description: "에너지 거래의 미래를 경험하세요",
    cta: { text: "자세히 보기", href: "/trading" },
  },
  {
    title: "실시간 분석",
    subtitle: "AI 기반 인사이트",
    description: "데이터 중심 의사 결정을 내리세요",
    cta: { text: "대시보드 보기", href: "/dashboard" },
  },
  {
    title: "지속 가능한 미래",
    subtitle: "친환경 에너지 솔루션",
    description: "재생 가능 에너지 혁명에 동참하세요",
    cta: { text: "더 알아보기", href: "/about" },
  },
];

// 메인 컴포넌트 정의
function VideoPart() {
  const [currentSlide, setCurrentSlide] = useState(0); // 현재 슬라이드 상태 관리

  // 자동 슬라이드 전환을 위한 타이머 설정
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length); // 마지막 슬라이드에서 처음으로 돌아감
    }, 5000); // 5초마다 슬라이드 전환
    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 제거
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 배경 비디오 */}
      <video
        src="/assets/videos/istockphoto-1569244272-640_adpp_is.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* 로고 애니메이션 (내려오는 효과) */}
      <motion.div
        initial={{ y: -200, opacity: 0 }} // 초기 위치와 투명도
        animate={{ y: 0, opacity: 0.7 }} // 애니메이션 후 위치와 투명도
        transition={{ duration: 1.5, ease: "easeOut" }} // 부드러운 애니메이션
        className="absolute inset-0 z-0 flex items-center justify-center"
      >
        <h1 className="text-center">
          <span className="bg-gradient-to-r from-teal-200 to-blue-300 bg-clip-text text-[100px] font-bold text-transparent sm:text-[200px] md:text-[250px] lg:text-[300px]">
            WattsUp
          </span>
        </h1>
      </motion.div>

      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* 슬라이드 콘텐츠 애니메이션 */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {/* 슬라이드 전환 애니메이션 */}
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }} // 시작 상태 (투명도 0, 아래 위치)
            animate={{ opacity: 1, y: 0 }} // 애니메이션 완료 상태
            exit={{ opacity: 0, y: -20 }} // 슬라이드 사라질 때 상태
            transition={{ duration: 0.8, ease: "easeOut" }} // 부드러운 애니메이션 효과
            className="container mx-auto px-4"
          >
            <div className="text-center">
              {/* 슬라이드 부제목 */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-2 text-sm font-light tracking-wider text-gray-300 sm:mb-4 sm:text-base md:text-lg lg:text-xl"
              >
                {slides[currentSlide].subtitle}
              </motion.p>

              {/* 슬라이드 제목 */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-3 text-3xl font-bold text-white sm:mb-4 sm:text-4xl md:text-5xl lg:mb-6 lg:text-7xl"
              >
                {slides[currentSlide].title}
              </motion.h2>

              {/* 슬라이드 설명 */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mb-4 text-base font-light text-gray-300 sm:mb-6 sm:text-lg md:text-xl lg:mb-8 lg:text-2xl"
              >
                {slides[currentSlide].description}
              </motion.p>

              {/* Call-to-Action 버튼 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Link
                  href={slides[currentSlide].cta.href}
                  className="group inline-flex items-center gap-2 rounded-full border border-white px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white hover:text-black sm:px-6 sm:py-3 sm:text-base md:px-8 md:py-4 md:text-lg"
                >
                  {slides[currentSlide].cta.text}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 슬라이드 번호 표시 */}
        <div className="absolute bottom-4 right-4 font-light text-white sm:bottom-6 sm:right-6 md:bottom-8 md:right-8">
          <span className="text-xl sm:text-2xl md:text-3xl">
            {currentSlide + 1}
          </span>
          <span className="text-base opacity-50 sm:text-lg md:text-xl">
            /{slides.length}
          </span>
        </div>
      </div>
    </div>
  );
}

export default VideoPart;
