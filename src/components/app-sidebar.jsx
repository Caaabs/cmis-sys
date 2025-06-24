"use client";

import * as React from "react";
import { Command, SquareTerminal, Bot } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar({ isAdmin, ...props }) {
  const [navData, setNavData] = React.useState([]);

  React.useEffect(() => {
    setNavData(
      isAdmin
        ? [
            {
              title: "Dashboard",
              icon: SquareTerminal,
              items: [
                {
                  title: "Home",
                  url: "/admin",
                  isActive: window.location.pathname === "/admin",
                },
                {
                  title: "Monthly Reports",
                  url: "/admin/monthly-reports",
                  isActive:
                    window.location.pathname === "/admin/monthly-reports",
                },
                {
                  title: "Users",
                  url: "/admin/users",
                  isActive: window.location.pathname === "/admin/users",
                },
              ],
            },
          ]
        : [
            {
              title: "Dashboard",
              icon: SquareTerminal,
              items: [
                {
                  title: "My Reports",
                  url: "/my-reports",
                  isActive: window.location.pathname.includes("/my-reports"),
                },
              ],
            },
          ]
    );
  }, [isAdmin]);

  return (
    <Sidebar
      className="top-[--header-height] h-[calc(100svh-var(--header-height))] lg:h-[100svh]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">CMIS</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData} />
      </SidebarContent>
    </Sidebar>
  );
}
