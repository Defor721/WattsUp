"use client";

import {
  LayoutDashboard,
  BarChart2,
  TrendingUp,
  PanelLeft,
  X,
  FileText,
  Users,
  Database,
  Laptop,
} from "lucide-react";
import { useState } from "react";

import { useDeviceType } from "@/hooks/useDeviceType";
import useAccessToken from "@/auth/hooks/useAccessToken";
import { useUserStore } from "@/stores/useUserStore";

import NavHeader from "./Header";
import NavMain from "./Main";
import { NavUser } from "./User";
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
    id: "add-information",
    icon: BarChart2,
    label: "대시보드 추가 정보",
    href: "/dashboard/add-information",
  },
  // {
  //   id: "profit-analysis",
  //   icon: FileText,
  //   label: "데이터 분석",
  //   href: "/data-report",
  // },
  {
    id: "energy-trade",
    icon: TrendingUp,
    label: "전력 거래",
    href: "/energy-trade",
  },
  {
    id: "introduce",
    icon: Laptop,
    label: "소개",
    href: "/introduce",
  },
];

const adminItems = [
  {
    id: "user-management",
    icon: Users,
    label: "유저 관리",
    href: "/admin/user-management",
  },
  {
    id: "data-management",
    icon: Database,
    label: "데이터 관리",
    href: "/admin/data-management",
  },
];

function Sidebar() {
  const { accessToken } = useAccessToken();
  const { user } = useUserStore();

  const [isTabletExpanded, setIsTabletExpanded] = useState(false); // 모바일 확장 상태

  const { isTablet } = useDeviceType();

  const toggleTabletSidebar = () => setIsTabletExpanded((prev) => !prev);

  return (
    <div className="relative flex select-none">
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
        className={`fixed z-50 flex h-full w-16 flex-col bg-mainColor p-2 text-white transition-all duration-300 lg:w-64 ${isTabletExpanded && "w-64 shadow-lg"}`}
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

          {/* Content Section */}
          <div className="flex-1 overflow-y-auto">
            {/* Default Items */}
            <NavMain
              items={defaultItems}
              isTablet={isTablet}
              isTabletExpanded={isTabletExpanded}
            />

            {/* Separator */}
            {user.role === "admin" && (
              <div className="my-4 border-t border-gray-700"></div>
            )}

            {/* Admin Items */}
            {user.role === "admin" && (
              <NavMain
                items={adminItems}
                isTablet={isTablet}
                isTabletExpanded={isTabletExpanded}
              />
            )}
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
