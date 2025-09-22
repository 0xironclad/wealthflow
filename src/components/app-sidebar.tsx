"use client"

import type * as React from "react"
import { Landmark, LayoutDashboard, SquareActivity, ChartCandlestick, Brain, PiggyBank } from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useUser } from "@/context/UserContext"


const data = {
  user: {
    name: "",
    email: "",
    avatar: "",
  },
  navMain: [
    {
      title: "Overview",
      url: "/overview",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Transactions",
      url: "/transaction",
      icon: Landmark,
    },
    {
      title: "Budget",
      url: "/budget",
      icon: PiggyBank,
    },
    {
      title: "Goals",
      url: "/goals",
      icon: ChartCandlestick,
    },
    {
      title: "Insights",
      url: "/insights",
      icon: Brain,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  data.user.name = "Tester"
  data.user.email = user?.email || ""
  data.user.avatar = ""
  return (
    <Sidebar collapsible="icon" {...props} className="h-[calc(100vh-1rem)] rounded-xl overflow-hidden">
      <SidebarHeader className="rounded-t-xl">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="WealthFlow">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <SquareActivity className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">WealthFlow</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="rounded-b-xl">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
