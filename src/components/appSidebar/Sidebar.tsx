"use client";

import {
  LayoutDashboard,
  BarChart2,
  DollarSign,
  RefreshCw,
  Settings,
  TrendingUp,
  PanelLeft,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import NavHeader from "./NavHeader";
import NavMain from "./NavMain";
import { NavUser } from "./NavUser";

// Menu items
const items = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  {
    icon: BarChart2,
    label: "Power Generation Forecasting",
    href: "/dashboard/predict",
  },
  {
    icon: DollarSign,
    label: "Profitability Analysis",
    href: "/profitability-analysis",
  },
  { icon: TrendingUp, label: "Energy Trade", href: "/energytrade" },
  { icon: RefreshCw, label: "Trading", href: "/trading" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const user = {
  name: "김터빈",
  email: "김터빈@gmail.com",
  avatar: "/avatars/shadcn.jpg",
};

function Sidebar() {
  const isMobile = useIsMobile(); // 모바일 여부 확인
  const [isMobileExpanded, setIsMobileExpanded] = useState(false); // 모바일 확장 상태

  const toggleMobileSidebar = () => setIsMobileExpanded((prev) => !prev);
  return (
    <div className={`relative flex`}>
      {/* Overlay for mobile when sidebar is expanded */}
      {isMobile && isMobileExpanded && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/70"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed z-50 flex h-screen flex-col bg-[rgb(7,15,38)] text-white transition-all duration-300 md:relative",
          isMobile ? "w-16" : "w-64", // 모바일에서는 아이콘만 보이게, 데스크탑에서는 확장된 상태
          isMobileExpanded && "w-64 shadow-lg", // 모바일 확장 상태에서 강조
        )}
      >
        {/* 모바일에서만 Trigger Button 표시 */}
        {isMobile && (
          <button
            className="absolute right-[-30px] rounded-full bg-[rgb(7,15,38)] p-2 text-white shadow-md"
            onClick={toggleMobileSidebar}
          >
            {isMobileExpanded ? <X /> : <PanelLeft />}
          </button>
        )}

        {/* Sidebar Sections */}
        <div className="flex h-full flex-col">
          {/* Header Section */}
          <div
            className={cn(
              // "transition-all duration-300",
              isMobile && !isMobileExpanded ? "items-center" : "",
            )}
          >
            <NavHeader
              isMobile={isMobile}
              isMobileExpanded={isMobileExpanded}
            />
          </div>
          {/* Content Section */}
          <div className="flex-1 overflow-y-auto">
            {isMobile && !isMobileExpanded ? (
              // 아이콘만 표시
              <div className="flex flex-col items-center gap-6 p-2">
                {/* 여기에 아이콘 메뉴 추가 */}
                {items.map((item) => (
                  <Link
                    key={item.label}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-white hover:text-[rgb(7,15,38)] hover:opacity-80"
                    href={item.href}
                  >
                    <item.icon />
                  </Link>
                ))}
                {/* 아이콘 예시 */}
              </div>
            ) : (
              // 전체 사이드바 표시
              <div className="p-4">
                <NavMain items={items} />
              </div>
            )}
          </div>
          {/* Footer Section */}
          <div
            className={cn(
              // "p-4 transition-all duration-300",
              isMobile && !isMobileExpanded ? "items-center" : "",
            )}
          >
            <NavUser
              user={user}
              isMobile={isMobile}
              isMobileExpanded={isMobileExpanded}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
