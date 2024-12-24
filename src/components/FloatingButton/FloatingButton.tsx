"use client";

import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useTheme } from "next-themes";

function FloatingButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY / document.documentElement.scrollHeight) * 100;

      // 스크롤이 30% 이상일 때 버튼 보이기
      if (scrollPercentage > 30) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isVisible]);

  const handleExpandedClick = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleScrollTopClick = () => {
    window.scrollTo({
      top: 0, // 스크롤 위치를 최상단으로 설정
      behavior: "smooth", // 부드러운 스크롤 애니메이션
    });
  };

  const handleThemeChangeClick = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    console.log("theme: ", theme);
  }, [theme]);

  return (
    <div className="relative">
      <button
        onClick={handleExpandedClick}
        className={`fixed bottom-5 right-[-100px] z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[rgb(7,15,38)] opacity-70 transition-transform duration-500 ease-in-out hover:cursor-pointer hover:opacity-100 ${
          isVisible ? "translate-x-[-120px]" : ""
        }`}
      >
        <HiOutlineDotsVertical
          size={"24px"}
          className="text-white opacity-80"
        />
      </button>

      <button
        onClick={handleScrollTopClick}
        className={`fixed bottom-[80px] right-[-100px] z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gray-500 opacity-70 transition-all duration-500 ease-in-out hover:cursor-pointer hover:opacity-100 ${
          isExpanded ? "translate-x-[-120px] opacity-100" : "opacity-0"
        }`}
      >
        <FaArrowUp size={"20px"} className="text-white opacity-80" />
      </button>

      {/* 화면 테마 버튼 */}
      <button
        onClick={handleThemeChangeClick}
        className={`fixed bottom-[140px] right-[-100px] z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gray-500 opacity-70 transition-all duration-500 ease-in-out hover:cursor-pointer hover:opacity-100 ${
          isExpanded ? "translate-x-[-120px] opacity-100" : "opacity-0"
        }`}
      >
        {theme === "dark" ? (
          <MdOutlineLightMode size={"24px"} className="text-white opacity-80" />
        ) : (
          <MdOutlineDarkMode size={"24px"} className="text-white opacity-80" />
        )}
      </button>
    </div>
  );
}

export default FloatingButton;
