"use client";

import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

function FloatingButton() {
  const [isExpanded, setIsExpanded] = useState(false); // 테마 변경 버튼 보이기 여부
  const [isScrollTopVisible, setIsScrollTopVisible] = useState(false); // 스크롤 최상단 버튼 보이기 여부
  const { setTheme, theme } = useTheme();

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY / document.documentElement.scrollHeight) * 100;

      setIsScrollTopVisible(scrollPercentage > 30); // 30% 이상 스크롤 시 버튼 표시
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 플로팅 버튼 클릭: 테마 변경 버튼 보이기
  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  // 스크롤 최상단 버튼 클릭
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 테마 변경 버튼 클릭
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // 공통 버튼 스타일
  const buttonBaseClass =
    "fixed z-10 flex h-12 w-12 items-center justify-center rounded-full opacity-70 transition-all duration-500 ease-in-out hover:cursor-pointer hover:opacity-100";

  return (
    <div className="relative">
      {/* 플로팅 버튼 (항상 보임) */}
      <button
        onClick={toggleExpanded}
        className={cn(
          buttonBaseClass,
          "bottom-5 right-5 bg-gray-500 opacity-90",
        )}
      >
        <HiOutlineDotsVertical size="24px" className="text-white opacity-80" />
      </button>

      {/* 테마 변경 버튼 (플로팅 버튼 클릭 시 보임) */}
      <button
        onClick={toggleTheme}
        className={cn(
          buttonBaseClass,
          "bottom-[80px] right-[-100px] bg-gray-500",
          isExpanded
            ? "translate-x-[-120px] opacity-100"
            : "translate-x-0 opacity-0",
        )}
      >
        {theme === "dark" ? (
          <MdOutlineLightMode size="24px" className="text-white opacity-80" />
        ) : (
          <MdOutlineDarkMode size="24px" className="text-white opacity-80" />
        )}
      </button>

      {/* 스크롤 최상단 버튼 (30% 이상 스크롤 시 보임) */}
      <button
        onClick={scrollToTop}
        className={cn(
          buttonBaseClass,
          "bottom-[140px] right-[-100px] bg-gray-500",
          isScrollTopVisible && isExpanded
            ? "translate-x-[-120px] opacity-100"
            : "translate-x-0 opacity-0",
        )}
      >
        <FaArrowUp size="20px" className="text-white opacity-80" />
      </button>
    </div>
  );
}

export default FloatingButton;
