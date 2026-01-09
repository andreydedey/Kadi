import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import { faWallet } from "@fortawesome/free-solid-svg-icons/faWallet";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { faFolder } from "@fortawesome/free-regular-svg-icons/faFolder";
import { faBorderAll } from "@fortawesome/free-solid-svg-icons/faBorderAll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const AppSidebar = () => {
  return (
    <Sidebar variant="inset" className="pl-5">
      <SidebarHeader className="p-0 mb-4">
        <h1 className="my-2 text-3xl font-medium">KADI</h1>
      </SidebarHeader>
      <SidebarContent className="space-y-0.5">
        <SidebarMenuButton className="py-5 rounded-sm text-lg" asChild>
          <Link to={"#"}>
            <FontAwesomeIcon icon={faBorderAll} className="mr-2" />
            Dashboard
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton className="py-5 rounded-sm text-lg" asChild>
          <Link to={"#"}>
            <FontAwesomeIcon icon={faWallet} className="mr-2" />
            Wallets
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton className="py-5 rounded-sm text-lg" asChild>
          <Link to={"#"}>
            <FontAwesomeIcon icon={faFolder} className="mr-2" />
            Categories
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton className="py-5 rounded-sm text-lg" asChild>
          <Link to={"#"}>
            <FontAwesomeIcon icon={faGear} className="mr-2" />
            Settings
          </Link>
        </SidebarMenuButton>
      </SidebarContent>
    </Sidebar>
  );
};
