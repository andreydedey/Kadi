import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router"
import { faWallet } from "@fortawesome/free-solid-svg-icons/faWallet"
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear"
import { faFolder } from "@fortawesome/free-regular-svg-icons/faFolder"
import { faBorderAll } from "@fortawesome/free-solid-svg-icons/faBorderAll"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const AppSidebar = () => {
  const location = useLocation()

  const isActiveRoute = (route: string) => {
    if (route === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(route)
  }

  const menuItems = [
    { to: "/", label: "DashBoard", icon: faBorderAll },
    { to: "/wallets", label: "Wallets", icon: faWallet },
    { to: "/categories", label: "Categories", icon: faFolder },
    { to: "/settings", label: "Settings", icon: faGear },
  ]

  return (
    <Sidebar variant="inset" className="pl-5">
      <SidebarHeader className="p-0 mb-4">
        <h1 className="my-2 text-3xl font-medium">KADI</h1>
      </SidebarHeader>
      <SidebarContent className="space-y-0.5">
        {menuItems.map((item) => (
          <SidebarMenuButton
            className="py-5 rounded-sm text-lg"
            asChild
            isActive={isActiveRoute(item.to)}
            key={item.to}
          >
            <Link to={item.to}>
              <FontAwesomeIcon icon={item.icon} className="mr-2" />
              {item.label}
            </Link>
          </SidebarMenuButton>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
