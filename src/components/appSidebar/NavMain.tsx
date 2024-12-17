import React from "react";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/sidebar";

interface data {
  icon: any;
  label: string;
  href: string;
}

interface Props {
  items: data[];
}

function NavMain({ items }: Props) {
  return (
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
  );
}

export default NavMain;
