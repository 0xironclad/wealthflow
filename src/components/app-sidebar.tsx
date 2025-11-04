"use client"

import type * as React from "react"
import { Landmark, LayoutDashboard, SquareActivity, ChartCandlestick, Brain, PiggyBank, HelpCircle, Coins } from "lucide-react"
import Link from "next/link"

import { NavMain } from "./nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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

  return <AppSidebarContent {...props} />
}

function AppSidebarContent({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile, state } = useSidebar()
  const isCollapsed = state === "collapsed"
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
      <SidebarFooter className="rounded-b-xl border-t">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="sm" className="gap-2">
                <Link href="/help" prefetch>
                  <HelpCircle className="h-4 w-4" />
                  <span>Help & Support</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="px-2 py-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent/50 p-2 text-xs cursor-pointer group-data-[collapsible=icon]:justify-center">
                  <Coins className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
                    Track your wealth, grow your future
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" hidden={!isCollapsed || isMobile}>
                <p>Track your wealth, grow your future</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </SidebarGroup>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
