"use client";

import { ReactNode } from "react";
import { Menu } from "lucide-react";

import { useSidebarStore } from "@/stores/sidebarStore";

import { SidebarToggle } from "./SidebarToggle";

interface SidebarStateWrapperProps {
  children: ReactNode;
}

export function SidebarStateWrapper({ children }: SidebarStateWrapperProps) {
  const isOpen = useSidebarStore((state) => state.isOpen);

  return (
    <>
      <div className="bg-[rgb(7,15,38)] p-4">
        <Menu />
      </div>

      <SidebarToggle />
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          isOpen ? "md:ml-48" : "ml-0"
        }`}
      >
        {children}
      </div>
    </>
  );
}
