// app/(main)/layout.tsx

import Sidebar from "@/components/appSidebar/Sidebar";
import { SidebarProvider } from "@/components/shadcn";

function MainLayout({ children }: { children: React.ReactNode }) {
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
