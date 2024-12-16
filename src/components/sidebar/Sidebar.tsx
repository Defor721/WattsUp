"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  BarChart2,
  DollarSign,
  RefreshCw,
  Settings,
  User,
  LogOut,
  TrendingUp,
  Search,
} from "lucide-react";

import { Separator } from "@/components/shadcn/separator";

import { Input } from "../shadcn/input";
import { UserDropdown } from "./UserDropdown";

const sidebarItems = [
  { icon: Home, label: "Dashboard" },
  { icon: BarChart2, label: "Power Generation Forecasting" },
  { icon: DollarSign, label: "Profitability Analysis" },
  {
    icon: TrendingUp,
    label: "energytrade",
  },
  { icon: RefreshCw, label: "Trading" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="flex h-[100vh] min-h-screen w-[30vh] flex-col justify-between bg-[rgb(7,15,38)] p-4 text-white">
      <div className="flex-grow overflow-y-auto">
        <div className="flex flex-col">
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
          <div className="w-full max-w-xl flex-1">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search..."
                className="w-full border-[rgb(20,35,80)] bg-[rgb(13,23,53)] pl-10 text-white placeholder-gray-400"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            </div>
          </div>

          <Separator className="mb-4" />
          <nav className="space-y-1 px-3">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                href={`/${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-white hover:text-base hover:text-[rgb(7,15,38)] hover:opacity-80"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="ml-4 flex w-full items-center">
        <UserDropdown />
      </div>
    </aside>
  );
}
