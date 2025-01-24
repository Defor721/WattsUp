"use client";

import { motion, AnimatePresence } from "framer-motion"; // 애니메이션 효과를 위한 라이브러리
import React, { useState, useEffect } from "react"; // React 훅
import { ArrowRight } from "lucide-react"; // 아이콘 라이브러리
import Link from "next/link"; // Next.js 라우팅

// 슬라이드 데이터 타입 정의
interface Slide {
  title: string; // 슬라이드 제목
  subtitle: string; // 부제목
  description: string; // 설명
  cta: { text: string; href: string }; // Call-to-Action 데이터
}

// 슬라이드 데이터
const slides: Slide[] = [
  {
    title: "스마트 에너지 거래",
    subtitle: "전력 교환의 혁신",
    description: "에너지 거래의 미래를 경험하세요",
    cta: { text: "자세히 보기", href: "/energy-trade" },
  },
  {
    title: "실시간 분석",
    subtitle: "투명하고 정확한 데이터",
    description: "데이터 중심 의사 결정을 내리세요",
    cta: { text: "대시보드 보기", href: "/dashboard" },
  },
  {
    title: "지속 가능한 미래",
    subtitle: "친환경 에너지 솔루션",
    description: "재생 가능 에너지 혁명에 동참하세요",
    cta: { text: "더 알아보기", href: "/introduce" },
  },
];

// 메인 컴포넌트
const VideoPart: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0); // 현재 슬라이드 상태

  // 자동 슬라이드 전환 설정
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length); // 슬라이드 순환
    }, 5000); // 5초마다 실행

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

      {/* 로고 애니메이션 */}
      <motion.div
        initial={{ y: -200, opacity: 0 }}
        animate={{ y: 0, opacity: 0.7 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0 flex items-center justify-center"
      >
        <h1 className="text-center">
          <span className="bg-gradient-to-r from-teal-200 to-blue-300 bg-clip-text text-[100px] font-bold text-transparent opacity-80 sm:text-[200px] md:text-[250px] lg:text-[230px]">
            WattsUp
          </span>
        </h1>
      </motion.div>

      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-60" />

      {/* 슬라이드 콘텐츠 */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`slide-${currentSlide}`} // 고유 key로 오류 방지
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="container mx-auto px-4"
          >
            <div className="text-center">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-2 text-sm font-light tracking-wider text-gray-300 sm:mb-4 sm:text-base md:text-lg lg:text-xl"
              >
                {slides[currentSlide].subtitle}
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-3 text-3xl font-bold text-white sm:mb-4 sm:text-4xl md:text-5xl lg:mb-6 lg:text-7xl"
              >
                {slides[currentSlide].title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mb-4 text-base font-light text-gray-300 sm:mb-6 sm:text-lg md:text-xl lg:mb-8 lg:text-2xl"
              >
                {slides[currentSlide].description}
              </motion.p>

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

        {/* 슬라이드 네비게이션 */}
        <div className="absolute bottom-12 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-4 w-4 rounded-full border-2 ${
                currentSlide === index
                  ? "bg-white"
                  : "border-white bg-transparent"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPart; // 컴포넌트 내보내기
