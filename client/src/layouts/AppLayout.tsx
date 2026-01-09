import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export const AppLayout = () => {
  console.log("passou por aqui");
  return (
    <SidebarProvider>
      <div className="flex min-h-screen p-4 box-border">
        <AppSidebar />
        <main className="flex-1">
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
