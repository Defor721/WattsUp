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
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-[rgb(20,35,80)] hover:text-white"
        href={"/login"}
      >
        <LogIn />
      </Link>
    );

  // 테블릿 화면에서 사이드바 확장 and 평상시 화면
  return (
    <Link
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-[rgb(20,35,80)] hover:text-white md:text-base"
      href={"/login"}
    >
      <LogIn />
      <span>로그인</span>
    </Link>
  );
}

export default NotLogin;
