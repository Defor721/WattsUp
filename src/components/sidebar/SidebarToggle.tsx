"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { useSidebarStore } from "@/stores/sidebarStore";

export function SidebarToggle() {
  const toggle = useSidebarStore((state) => state.toggle);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed left-4 top-4 z-50 md:hidden"
      onClick={toggle}
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
}
