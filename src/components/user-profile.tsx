"use client"

import { useUser } from "@/context/UserContext"
import { useUserData } from "@/hooks/useUserData"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Calendar, Shield, CheckCircle2, XCircle } from "lucide-react"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

interface UserProfileProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function UserProfile({ open, onOpenChange }: UserProfileProps) {
    const { user, isLoading: isAuthLoading } = useUser()
    const { data: userData, isLoading: isLoadingUserData } = useUserData()

    const isLoading = isAuthLoading || isLoadingUserData

    const initials = user?.email
        ?.split("@")[0]
        .split("")
        .slice(0, 2)
        .map((c) => c.toUpperCase())
        .join("") || "U"

    const displayName = userData?.name || user?.email?.split("@")[0] || "User"
    const email = user?.email || ""
    const isEmailVerified = user?.email_confirmed_at || userData?.is_email_verified
    const createdAt = user?.created_at || userData?.created_at
    const lastLogin = userData?.last_login

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Profile</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-6 py-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-20 w-20 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-4 w-64" />
                            </div>
                        </div>
                        <Skeleton className="h-32 w-full" />
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        {/* Profile Header */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={user?.user_metadata?.avatar_url} alt={displayName} />
                                        <AvatarFallback className="text-lg">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <CardTitle className="text-2xl mb-1">{displayName}</CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            {email}
                                        </CardDescription>
                                        {isEmailVerified ? (
                                            <Badge variant="default" className="mt-2">
                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                Email Verified
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="mt-2">
                                                <XCircle className="h-3 w-3 mr-1" />
                                                Email Not Verified
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Account Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Information</CardTitle>
                                <CardDescription>Your account details and settings</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Email Address</p>
                                            <p className="text-xs text-muted-foreground">{email}</p>
                                        </div>
                                    </div>
                                    {isEmailVerified && (
                                        <Badge variant="outline" className="text-xs">
                                            Verified
                                        </Badge>
                                    )}
                                </div>

                                {createdAt && (
                                    <div className="flex items-center justify-between py-2 border-b">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Member Since</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {format(new Date(createdAt), "MMMM dd, yyyy")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {lastLogin && (
                                    <div className="flex items-center justify-between py-2 border-b">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Last Login</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {format(new Date(lastLogin), "MMMM dd, yyyy 'at' h:mm a")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Account ID</p>
                                            <p className="text-xs text-muted-foreground font-mono">
                                                {user?.id?.substring(0, 8)}...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

