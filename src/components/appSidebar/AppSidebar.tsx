"usev client";

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
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/shadcn/sidebar";

import { UserDropdown } from "../sidebar/UserDropdown";

// Menu items.
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
function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="bg-[rgb(7,15,38)] text-white">
      <SidebarContent>
        <SidebarGroup>
          <Link href="/" className="relative flex items-center p-4">
            <Image
              src="/assets/images/logo.webp"
              width={80}
              height={80}
              alt="WattsUp Logo"
              className="rounded-md opacity-70"
            />
            <SidebarGroupLabel className="bg-gradient-to-r from-teal-200 to-blue-300 bg-clip-text text-[26px] font-bold text-transparent">
              {"WattsUp"}
            </SidebarGroupLabel>
          </Link>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-white hover:text-[rgb(7,15,38)] hover:opacity-80"
                      href={item.href}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserDropdown />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
