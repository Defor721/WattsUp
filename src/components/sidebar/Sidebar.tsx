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
} from "lucide-react";

import { Separator } from "@/components/shadcn/separator";

import { UserDropdown } from "./UserDropdown";

const sidebarItems = [
  { icon: Home, label: "Dashboard" },
  { icon: BarChart2, label: "Power Generation Forecasting" },
  { icon: DollarSign, label: "Profitability Analysis" },
  { icon: RefreshCw, label: "Trading" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="shadow-right flex h-screen w-[30vh] flex-col justify-between bg-[#000000] p-4 text-white">
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
              Watts_uP
            </span>
          </Link>

          <Separator className="mb-4" />
          <nav className="space-y-1 px-3">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                href={`/${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-white hover:text-base hover:text-black hover:opacity-80"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="mt-auto p-4">
        <UserDropdown />
      </div>
    </aside>
  );
}
