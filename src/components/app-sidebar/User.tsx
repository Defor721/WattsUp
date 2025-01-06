"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/sidebar";
import { useAuthStore } from "@/auth/useAuthStore";
import useAccessToken from "@/auth/hooks/useAccessToken";

import { Button } from "../shadcn";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface UserProps {
  user: User;
  isTablet: boolean;
  isTabletExpanded: boolean;
}

export function NavUser({ user, isTablet, isTabletExpanded }: UserProps) {
  const {
    actions: { logout },
  } = useAuthStore();
  const router = useRouter();

  const { resetAccessToken } = useAccessToken();

  const handleLogout = async () => {
    await logout();
    resetAccessToken();
    router.push("/");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            {/* 조건에 따라 UI 변경 */}
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* 테블릿 화면이고, 사이드바 확장시키지 않은 경우 */}
              {isTablet && !isTabletExpanded ? (
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
              ) : (
                // 확장 상태 또는 데스크탑에서 아이콘과 사용자 정보 표시
                <>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* 드롭다운 메뉴 */}
          <DropdownMenuContent
            className="position:fixed w-[--radix-dropdown-menu-trigger-width] min-w-56 overflow-y-auto rounded-lg bg-[rgb(7,15,38)] text-white"
            side={isTablet && !isTabletExpanded ? "right" : "top"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-2 px-2 py-[6px] text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-sm font-medium text-gray-200">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-gray-300">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className={"bg-slate-999"} />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link
                  href="/my-page"
                  className="flex items-center gap-2 py-1 text-gray-300 hover:bg-[rgb(20,35,80)] hover:text-white"
                >
                  <User />
                  Mypage
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link
                  href="/editprofile"
                  className="flex items-center gap-2 py-1 text-gray-300 hover:bg-[rgb(20,35,80)] hover:text-white"
                >
                  <Settings />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuItem>
              <Button
                className="flex h-7 items-center gap-2 p-0 py-1 text-gray-300 hover:bg-[rgb(20,35,80)] hover:text-white"
                onClick={handleLogout}
              >
                <LogOut />
                Log out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
