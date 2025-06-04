import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "../ui/sidebar";
import {
  CalendarCheck,
  ChartNoAxesCombined,
  ClipboardList,
  Home,
  LayoutList,
  MessageCircle,
  Settings,
  Users,
} from "lucide-react";
import SidebarButton from "./sidebar-btn";
import SidebarAgencyFooter from "./sidebar-footer";

const AppSidebar = async ({ agencyId }: { agencyId: string }) => {
  const ROOTPATH = `/app/${agencyId}`;
  const items = [
    { title: "Dashboard", url: ROOTPATH, icon: <Home /> },
    { title: "Listings", url: `${ROOTPATH}/listings`, icon: <LayoutList /> },
    {
      title: "Inquiries",
      url: `${ROOTPATH}/inquiries`,
      icon: <MessageCircle />,
    },
    { title: "Agents", url: `${ROOTPATH}/agents`, icon: <Users /> },
    {
      title: "Analytics",
      url: `${ROOTPATH}/analytics`,
      icon: <ChartNoAxesCombined />,
    },
    {
      title: "Appointments",
      url: `${ROOTPATH}/appointments`,
      icon: <CalendarCheck />,
    },
    { title: "Reports", url: `${ROOTPATH}/reports`, icon: <ClipboardList /> },
    { title: "Settings", url: `${ROOTPATH}/settings`, icon: <Settings /> },
  ];
  return (
    // Navbar height
    <Sidebar collapsible="icon" className="top-[10vh] h-[90vh]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(async (item) => (
                <SidebarButton key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarAgencyFooter />
    </Sidebar>
  );
};

export default AppSidebar;
