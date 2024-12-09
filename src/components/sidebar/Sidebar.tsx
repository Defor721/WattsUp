"use client";

import Image from "next/image";
import React from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sidebarItems = [
  { icon: Home, label: "Dashboard" },
  { icon: BarChart2, label: "Power Generation Forecasting" },
  { icon: DollarSign, label: "Profitability Analysis" },
  { icon: RefreshCw, label: "Trading" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="hadow-right flex h-screen w-64 flex-col justify-between bg-[#020232f4] p-6 text-white">
      <div className="flex-grow overflow-y-auto">
        <div className="flex flex-col">
          <Link href="/" className="flex items-center gap-2 p-6">
            <Image
              src="/assets/images/logo.webp"
              width={48}
              height={48}
              alt="WattsUp Logo"
              className="rounded-md"
            />
            <span className="bg-gradient-to-r from-teal-200 to-blue-300 bg-clip-text text-2xl font-bold text-transparent">
              WattsUp
            </span>
          </Link>
          <Separator className="mb-4" />
          <nav className="space-y-1 px-3">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                href={`/${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="mt-auto p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-blue-50">
            <Image
              src="/assets/images/avatar-placeholder.png"
              width={36}
              height={36}
              alt="User Avatar"
              className="rounded-full"
            />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-500">john.doe@example.com</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
