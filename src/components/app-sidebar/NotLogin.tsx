import React from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";

interface Props {
  isTablet: boolean;
  isTabletExpanded: boolean;
}

function NotLogin({ isTablet, isTabletExpanded }: Props) {
  if (isTablet && !isTabletExpanded)
    return (
      <Link
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-white hover:text-[rgb(7,15,38)] hover:opacity-80"
        href={"/login"}
      >
        <LogIn />
      </Link>
    );

  // 테블릿 화면에서 사이드바 확장 and 평상시 화면
  return (
    <Link
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-white hover:text-[rgb(7,15,38)] hover:opacity-80 md:text-base"
      href={"/login"}
    >
      <LogIn />
      <span>로그인</span>
    </Link>
  );
}

export default NotLogin;
