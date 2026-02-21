import { AppSidebar } from "@/components/AppSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router"

export const AppLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen min-w-screen p-4 box-border gap-8">
        <AppSidebar />
        <main className="flex-1">
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
