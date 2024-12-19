"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/sidebar";

interface NavHeaderProps {
  isTablet: boolean;
  isTabletExpanded: boolean;
}

function NavHeader({ isTablet, isTabletExpanded }: NavHeaderProps) {
  return (
    <>
      {/* 테블릿 화면에서 사이드바 확장 and 평상시 화면 */}
      {(isTabletExpanded || (!isTablet && !isTabletExpanded)) && (
        <Link href="/" className="relative flex items-center p-4">
          <Image
            src="/assets/images/logo.webp"
            width={80}
            height={80}
            alt="WattsUp Logo"
            className="rounded-lg opacity-70"
          />
          <SidebarGroupLabel className="bg-gradient-to-r from-teal-200 to-blue-300 bg-clip-text text-[26px] font-bold text-transparent">
            {"WattsUp"}
          </SidebarGroupLabel>
        </Link>
      )}
      {/* 테블릿 화면일 경우 */}
      {isTablet && !isTabletExpanded && (
        <SidebarMenu className="mt-9">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="transition-all duration-200">
                <Image
                  src="/assets/images/logo.webp"
                  width={30}
                  height={30}
                  alt="WattsUp Logo"
                  className="rounded-md opacity-70"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      )}
    </>
  );
}

export default NavHeader;
