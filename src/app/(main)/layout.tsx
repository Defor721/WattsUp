// app/(main)/layout.tsx

import { ReactNode } from "react";

import Sidebar from "@/components/app-sidebar/Sidebar";
import { SidebarProvider } from "@/components/shadcn";

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <Sidebar />
        <div className="min-h-screen flex-1 select-none dark:bg-subColor">
          {children}
        </div>
      </SidebarProvider>
    </>
  );
}

export default MainLayout;
