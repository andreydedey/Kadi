import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export const AppLayout = () => {
  return (
    <SidebarProvider>
      <div>
        <AppSidebar />
        <main>
          <header>
            <SidebarTrigger />
          </header>

          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
