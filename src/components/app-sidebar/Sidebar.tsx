"use client";

import {
  LayoutDashboard,
  BarChart2,
  TrendingUp,
  Search,
  PanelLeft,
  X,
  FileText,
  Users,
  Database,
} from "lucide-react";
import { useState } from "react";

import { useDeviceType } from "@/hooks/useDeviceType";
import useAccessToken from "@/auth/useAccessToken";

import NavHeader from "./Header";
import NavMain from "./Main";
import { NavUser } from "./User";
import { Input } from "../shadcn";
import NotLogin from "./NotLogin";

// Menu defaultItems
const defaultItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "대시보드",
    href: "/dashboard",
  },
  {
    id: "predict",
    icon: BarChart2,
    label: "태양광 발전량 예측",
    href: "/dashboard/predict",
  },
  { id: "profit-analysis", icon: FileText, label: "데이터 분석", href: "/" },
  {
    id: "energy-trade",
    icon: TrendingUp,
    label: "전력 거래",
    href: "/energy-trade",
  },
];

const adminItems = [
  {
    id: "user-management",
    icon: Users,
    label: "사용자 관리",
    href: "/admin/user-management",
  },
  {
    id: "data-management",
    icon: Database,
    label: "데이터 관리",
    href: "/admin/data-management",
  },
];

const user = {
  name: "김터빈",
  email: "김터빈@gmail.com",
  avatar: "/assets/images/logo.webp",
};

function Sidebar() {
  const { isTablet } = useDeviceType();
  const [isTabletExpanded, setIsTabletExpanded] = useState(false); // 모바일 확장 상태
  const { accessToken } = useAccessToken();
  const [userState, setUserState] = useState<"admin" | "normal">("admin");

  const items =
    userState === "admin" ? [...defaultItems, ...adminItems] : defaultItems;

  const toggleTabletSidebar = () => setIsTabletExpanded((prev) => !prev);
  return (
    <div className="relative flex">
      {/* 테블릿 화면에서 사이드바 확장시켰을 때 */}
      {isTabletExpanded && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/70"
          onClick={toggleTabletSidebar}
        />
      )}

      {/* 사이드바 */}
      <div className={`h-full w-16 lg:w-64`}></div>
      <aside
        className={`fixed z-50 flex h-full w-16 flex-col bg-[#070f26] p-2 text-white transition-all duration-300 lg:w-64 ${isTabletExpanded && "w-64 shadow-lg"}`}
      >
        <button
          className={`absolute bg-[#070f26] ${isTabletExpanded ? "right-[0px]" : "right-[12px]"} top-0 z-10 block p-2 lg:hidden`}
          onClick={toggleTabletSidebar}
        >
          {isTabletExpanded ? <X /> : <PanelLeft />}
        </button>

        {/* Sidebar Sections */}
        <div className="flex h-full flex-col">
          {/* Header Section */}
          <div>
            <NavHeader
              isTablet={isTablet}
              isTabletExpanded={isTabletExpanded}
            />
          </div>

          {/* Search Section */}
          {(!isTablet || isTabletExpanded) && (
            <div className="relative my-2 w-full">
              <Input
                type="search"
                placeholder="Search..."
                className="w-full border-[rgb(20,35,80)] bg-[rgb(13,23,53)] pl-10 text-white placeholder-gray-400"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            </div>
          )}

          {/* Content Section */}
          <div className="flex-1 overflow-y-auto">
            <NavMain
              items={items}
              isTablet={isTablet}
              isTabletExpanded={isTabletExpanded}
            />
          </div>

          {/* Footer Section */}
          {/* 로그인 여부에 따라 보이는 컴포넌트가 다름 */}
          {accessToken ? (
            <div className="rounded-md hover:bg-[rgb(20,35,80)] hover:text-white focus:bg-[rgb(20,35,80)] focus:text-white">
              <NavUser
                user={user}
                isTablet={isTablet}
                isTabletExpanded={isTabletExpanded}
              />
            </div>
          ) : (
            <NotLogin isTablet={isTablet} isTabletExpanded={isTabletExpanded} />
          )}
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
