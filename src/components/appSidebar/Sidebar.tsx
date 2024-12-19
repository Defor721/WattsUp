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

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import NavHeader from "./NavHeader";
import NavMain from "./NavMain";
import { NavUser } from "./NavUser";
import { Input } from "../shadcn";

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
  avatar: "/assets/images/logo.webp",
};

function Sidebar() {
  const isMobile = useIsMobile(); // 모바일 여부 확인
  const [isMobileExpanded, setIsMobileExpanded] = useState(false); // 모바일 확장 상태

  const toggleMobileSidebar = () => setIsMobileExpanded((prev) => !prev);
  return (
    <div className={`relative flex`}>
      {/* 테블릿 화면에서 사이드바 확장시켰을 때 */}
      {isMobile && isMobileExpanded && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/70"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* 사이드바 */}
      <div className={`h-full ${isMobile ? "w-16" : "w-64"}`}></div>
      <aside
        className={cn(
          "fixed z-50 flex h-full flex-col bg-[rgb(7,15,38)] p-2 text-white transition-all duration-300 md:fixed",
          isMobile ? "w-16" : "w-64", // 테블릿에서는 아이콘만 보이게, 데스크탑에서는 확장된 상태
          isMobileExpanded && "w-64 shadow-lg", // 테블릿 확장 상태에서 강조
        )}
      >
        {/* 테블릿에서만 Trigger Button 표시 */}
        {isMobile && (
          <button
            className="absolute right-[12px] top-0 z-10 bg-[rgb(7,15,38)] p-2 text-white shadow-md"
            onClick={toggleMobileSidebar}
          >
            {isMobileExpanded ? <X /> : <PanelLeft />}
          </button>
        )}

        {/* Sidebar Sections */}
        <div className="flex h-full flex-col">
          {/* Header Section */}
          <div>
            <NavHeader
              isMobile={isMobile}
              isMobileExpanded={isMobileExpanded}
            />
          </div>
          {/* Search Section */}
          <div className="relative my-2 w-full">
            <Input
              type="search"
              placeholder="Search..."
              className="w-full border-[rgb(20,35,80)] bg-[rgb(13,23,53)] pl-10 text-white placeholder-gray-400"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          </div>
          {/* Content Section */}
          <div className="flex-1 overflow-y-auto">
            <NavMain
              items={items}
              isMobile={isMobile}
              isMobileExpanded={isMobileExpanded}
            />
          </div>
          {/* Footer Section */}
          <div
            className={cn(
              "rounded-md hover:bg-[rgb(20,35,80)] hover:text-white focus:bg-[rgb(20,35,80)] focus:text-white",
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
