// app/(main)/layout.tsx

import { ReactNode } from "react";

import Sidebar from "@/components/app-sidebar/Sidebar";
import { SidebarProvider } from "@/components/shadcn";

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar />
      <main className="flex flex-1 bg-[#f9fafb] text-[rgb(7,15,38)]">
        {children}
      </main>
    </SidebarProvider>
  );
}

export default MainLayout;
