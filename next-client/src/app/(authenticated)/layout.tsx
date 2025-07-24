"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { Bell } from "lucide-react";
import { UserProvider } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {AccountManager} from "@/components/account-manager/account-manager";



export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full flex flex-col">
          <header className="flex h-7 shrink-0 items-center px-2">
            <SidebarTrigger className="h-7 w-7" />
            <Separator orientation="vertical" className="mx-2 h-4" />
            <div className="justify-end flex-1 flex items-center mr-5 mt-1 gap-2">
              <Bell className="h-5 w-5" />
              <ModeToggle />
              <Dialog >
                <DialogTrigger>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DialogTrigger>
                <DialogContent className="max-h-[85vh] overflow-y-auto styled-scrollbar p-0 m-0">
                  <DialogHeader>
                    <VisuallyHidden>
                      <DialogTitle>Account Details</DialogTitle>
                    </VisuallyHidden>
                  </DialogHeader>
                  <AccountManager />
                </DialogContent>
              </Dialog>
            </div>
          </header>
          <main className="flex-1 overflow-hidden">
            <UserProvider>
              {children}
            </UserProvider>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
