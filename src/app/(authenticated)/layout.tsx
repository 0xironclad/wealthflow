"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { UserProvider } from "@/context/UserContext";
import { Header } from "@/components/header";
import { useUser } from "@/context/UserContext";
import { Bell } from "lucide-react"


export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();



  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-x-hidden">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full flex flex-col">
          <header className="flex h-9 shrink-0 items-center px-2">
            <SidebarTrigger className="h-7 w-7" />
            <Separator orientation="vertical" className="mx-2 h-4" />
            {/* header */}
            <div className="flex items-center gap-2 ml-auto">
              <Bell className="h-4 w-4" />
              {!isLoading && user && <Header user={{
                name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
                email: user.email || '',
                avatar: user.user_metadata?.avatar_url || ''
              }} />}
            </div>
          </header>
          <main className="flex-1">
            <UserProvider>
              {children}
            </UserProvider>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
