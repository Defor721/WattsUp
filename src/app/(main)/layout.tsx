// app/(main)/layout.tsx

import { ReactNode } from "react";

import Sidebar from "@/components/app-sidebar/Sidebar";
import { SidebarProvider } from "@/components/shadcn";

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar />
      <main className="flex flex-1 p-3 text-mainColor dark:bg-[#050a18] md:p-5 lg:p-10">
        {children}
      </main>
    </SidebarProvider>
  );
}

export default MainLayout;
