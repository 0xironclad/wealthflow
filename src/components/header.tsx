"use client"

import {
    LogOut,
    User,
    Sun,
    Moon,
    Palette,
    Monitor
} from "lucide-react"
import { useTheme } from "next-themes"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu as DropdownMenuPrimitive,
    DropdownMenuContent as DropdownMenuContentPrimitive,
    DropdownMenuGroup as DropdownMenuGroupPrimitive,
    DropdownMenuItem as DropdownMenuItemPrimitive,
    DropdownMenuLabel as DropdownMenuLabelPrimitive,
    DropdownMenuSeparator as DropdownMenuSeparatorPrimitive,
    DropdownMenuTrigger as DropdownMenuTriggerPrimitive,
    DropdownMenuSub as DropdownMenuSubPrimitive,
    DropdownMenuSubContent as DropdownMenuSubContentPrimitive,
    DropdownMenuSubTrigger as DropdownMenuSubTriggerPrimitive,
} from "@/components/ui/dropdown-menu"

// Type cast for React 19 compatibility
/* eslint-disable @typescript-eslint/no-explicit-any */
const DropdownMenu = DropdownMenuPrimitive as any;
const DropdownMenuContent = DropdownMenuContentPrimitive as any;
const DropdownMenuGroup = DropdownMenuGroupPrimitive as any;
const DropdownMenuItem = DropdownMenuItemPrimitive as any;
const DropdownMenuLabel = DropdownMenuLabelPrimitive as any;
const DropdownMenuSeparator = DropdownMenuSeparatorPrimitive as any;
const DropdownMenuTrigger = DropdownMenuTriggerPrimitive as any;
const DropdownMenuSub = DropdownMenuSubPrimitive as any;
const DropdownMenuSubContent = DropdownMenuSubContentPrimitive as any;
const DropdownMenuSubTrigger = DropdownMenuSubTriggerPrimitive as any;
/* eslint-enable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { logout } from "@/app/actions/logout/actions"
import { useState } from "react"
import { UserProfile } from "./user-profile"

export function Header({
    user,
}: {
    user: {
        name: string
        email: string
        avatar: string
    }
}) {
    const { setTheme, theme } = useTheme()
    const [profileOpen, setProfileOpen] = useState(false)
    const handleLogout = async () => {
        try {
            await logout()
            window.location.reload()

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="ml-auto mr-2 mt-0.5">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                                {user.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                    side="right"
                    align="end"
                    sideOffset={4}
                >
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="rounded-lg">
                                    {user.name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.name}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                            <User />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <Palette />
                                Theme
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    <Sun className="mr-2 h-4 w-4" />
                                    <span>Light</span>
                                    {theme === "light" && (
                                        <span className="ml-auto">✓</span>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    <Moon className="mr-2 h-4 w-4" />
                                    <span>Dark</span>
                                    {theme === "dark" && (
                                        <span className="ml-auto">✓</span>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                    <Monitor className="mr-2 h-4 w-4" />
                                    <span>System</span>
                                    {theme === "system" && (
                                        <span className="ml-auto">✓</span>
                                    )}
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <UserProfile open={profileOpen} onOpenChange={setProfileOpen} />
        </div>
    )
}
