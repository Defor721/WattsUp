// app/(main)/layout.tsx

import Sidebar from "@/components/appSidebar/Sidebar";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { SidebarProvider } from "@/components/shadcn";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Sidebar />
        <main className="flex flex-1 bg-[#f9fafb] text-[rgb(7,15,38)]">
          {children}
        </main>
      </ThemeProvider>
    </SidebarProvider>
  );
}

export default MainLayout;
