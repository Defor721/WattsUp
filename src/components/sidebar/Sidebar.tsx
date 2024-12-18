"use client";

import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  BarChart2,
  DollarSign,
  RefreshCw,
  Settings,
  TrendingUp,
  Search,
  Menu,
  X,
} from "lucide-react";

import { useSidebarStore } from "@/stores/sidebarStore"; // Zustand 스토어
import { Separator } from "@/components/shadcn/separator";
import useCheckAccessToken from "@/auth/useCheckAccessToken";

import { Input } from "../shadcn/input";
import { UserDropdown } from "./UserDropdown";

const sidebarItems = [
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

export default function Sidebar() {
  const { isOpen, toggle } = useSidebarStore(); // Zustand 상태 관리
  // useCheckAccessToken();

  return (
    <>
      {/* 햄버거 메뉴 버튼 - 상단 고정 */}
      <button
        onClick={toggle}
        className="fixed left-4 top-4 z-50 rounded-md p-2 text-white hover:text-opacity-70"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* 사이드바 */}
      <aside
        className={`fixed left-0 top-0 h-full transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-[30vh] overflow-hidden bg-[rgb(7,15,38)] text-white`}
      >
        {isOpen && (
          <div className="flex h-full flex-col justify-between p-4">
            <div className="flex items-center p-4">
              <Link href="/" className="relative flex items-center p-4">
                <Image
                  src="/assets/images/logo.webp"
                  width={80}
                  height={80}
                  alt="WattsUp Logo"
                  className="rounded-md opacity-70"
                />
                <span className="absolute left-16 bg-gradient-to-r from-teal-200 to-blue-300 bg-clip-text text-3xl font-bold text-transparent">
                  WattsUp
                </span>
              </Link>
            </div>

            {/* 검색 입력 */}
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search..."
                className="w-full border-[rgb(20,35,80)] bg-[rgb(13,23,53)] pl-10 text-white placeholder-gray-400"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            </div>

            <Separator className="my-4" />

            {/* 네비게이션 메뉴 */}
            <nav className="space-y-1 px-3">
              {sidebarItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-white hover:text-[rgb(7,15,38)] hover:opacity-80"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>

            <div className="ml-4 mt-auto flex items-center">
              <UserDropdown />
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
