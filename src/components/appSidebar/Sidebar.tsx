"use client";

import {
  LayoutDashboard,
  BarChart2,
  DollarSign,
  RefreshCw,
  Settings,
  TrendingUp,
  Search,
  PanelLeft,
  X,
} from "lucide-react";
import { useState } from "react";

import useCheckAccessToken from "@/auth/useCheckAccessToken";
import { useDeviceType } from "@/hooks/useDeviceType";

import NavHeader from "./Header";
import NavMain from "./Main";
import { NavUser } from "./User";
import { Input } from "../shadcn";

// Menu items
const items = [
  { icon: LayoutDashboard, label: "대시보드", href: "/dashboard" },
  {
    icon: BarChart2,
    label: "전력 생산 예측",
    href: "/dashboard/predict",
  },
  {
    icon: DollarSign,
    label: "수익성 분석",
    href: "/",
  },
  { icon: TrendingUp, label: "전력 거래", href: "/energytrade" },
  // { icon: RefreshCw, label: "Trading", href: "/trading" },
  { icon: Settings, label: "설정", href: "/settings" },
];

const user = {
  name: "김터빈",
  email: "김터빈@gmail.com",
  avatar: "/assets/images/logo.webp",
};

function Sidebar() {
  useCheckAccessToken();

  // const
  const { isTablet } = useDeviceType();
  const [isTabletExpanded, setIsTabletExpanded] = useState(false); // 모바일 확장 상태

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
        className={`fixed z-50 flex h-full w-16 flex-col bg-[rgb(7,15,38)] p-2 text-white transition-all duration-300 lg:w-64 ${isTabletExpanded && "w-64 shadow-lg"}`}
      >
        <button
          className="absolute right-[12px] top-0 z-10 block bg-[rgb(7,15,38)] p-2 text-white shadow-md lg:hidden"
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
          <div className="rounded-md hover:bg-[rgb(20,35,80)] hover:text-white focus:bg-[rgb(20,35,80)] focus:text-white">
            <NavUser
              user={user}
              isTablet={isTablet}
              isTabletExpanded={isTabletExpanded}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
