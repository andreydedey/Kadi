import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

export const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <div>Dashboard</div>
        <div>Wallet</div>
        <div>Categories</div>
        <div>Settings</div>
      </SidebarContent>
    </Sidebar>
  );
};
