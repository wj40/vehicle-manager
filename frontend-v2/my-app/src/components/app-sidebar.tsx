import * as React from "react"
import { useNavigate } from "react-router-dom"
import { NavMain } from "@/components/nav-main"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, ListIcon, ClipboardPenLine, Brain, Car } from "lucide-react"


const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      title: "Vehicles",
      url: "/search",
      icon: (
        <ListIcon
        />
      ),
    },
    {
      title: "Register vehicle",
      url: "/register",
      icon: (
        <ClipboardPenLine
        />
      ),
    },
    {
      title: "Vehicle history",
      url: "/manage",
      icon: (
        <Brain
        />
      ),
    },
  ],
  // navClouds: [
  //   {
  //     title: "Capture",
  //     icon: (
  //       <CameraIcon
  //       />
  //     ),
  //     isActive: true,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Proposal",
  //     icon: (
  //       <FileTextIcon
  //       />
  //     ),
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Prompts",
  //     icon: (
  //       <FileTextIcon
  //       />
  //     ),
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  // ],
  
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
              onClick={() => navigate("/")}
            >
              <Car className="size-10!" />
              <span className="text-3xl font-semibold">VMS</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  )
}
