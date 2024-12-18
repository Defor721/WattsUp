import React from "react";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/sidebar";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../shadcn";

interface data {
  icon: any;
  label: string;
  href: string;
}

interface Props {
  items: data[];
  isMobile: boolean;
  isMobileExpanded: boolean;
}

function NavMain({ items, isMobile, isMobileExpanded }: Props) {
  return (
    <>
      {/* 테블릿 화면에서 사이드바 확장 and 평상시 화면 */}
      {(isMobileExpanded || (!isMobile && !isMobileExpanded)) && (
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton tooltip={item.label} asChild>
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
      )}

      {/* 테블릿 화면일 경우 */}
      {isMobile && !isMobileExpanded && (
        <div className="flex flex-col items-center gap-4 p-2">
          {items.map((item) => (
            <Link
              key={item.label}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-white hover:text-[rgb(7,15,38)] hover:opacity-80"
              href={item.href}
            >
              <item.icon />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default NavMain;
