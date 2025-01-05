// app/(main)/layout.tsx

import { ReactNode } from "react";

import Sidebar from "@/components/app-sidebar/Sidebar";
import { SidebarProvider } from "@/components/shadcn";

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar />
      <main className="flex-1 text-mainColor dark:bg-[#050a18] dark:text-white">
        {children}
      </main>
    </SidebarProvider>
  );
}

export default MainLayout;
