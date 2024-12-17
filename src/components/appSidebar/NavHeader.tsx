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
  isMobile: boolean;
  isMobileExpanded: boolean;
}

function NavHeader({ isMobile, isMobileExpanded }: NavHeaderProps) {
  return (
    <>
      {isMobile && !isMobileExpanded && (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Image
                  src="/assets/images/logo.webp"
                  width={48}
                  height={48}
                  alt="WattsUp Logo"
                  className="rounded-md opacity-70"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      )}
      {isMobileExpanded && (
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
      )}
      {!isMobile && !isMobileExpanded && (
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
      )}
    </>
  );
}

export default NavHeader;
