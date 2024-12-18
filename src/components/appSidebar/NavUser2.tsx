"use client";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface UserProps {
  user: User;
  isMobile: boolean;
  isMobileExpanded: boolean;
}
export function NavUser2({ user, isMobile, isMobileExpanded }: UserProps) {
  return (
    <div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button>드랍다운 버튼</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>1번 메뉴</DropdownMenuItem>
          <DropdownMenuItem>2번 메뉴</DropdownMenuItem>
          <DropdownMenuItem>3번 메뉴</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
