/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Edit, Save, X, Loader2, User } from "lucide-react"
import { useUser } from "@/context/UserContext"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUserData, updateUserProfile } from "@/server/user"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { AccountEdit } from "./account-edit"
import { AccountDetails } from "./account-details"

export function AccountManager() {
  const [isEditing, setIsEditing] = useState(false)
  const { user } = useUser()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data, isLoading } = useQuery({
    queryKey: ["userData", user?.id],
    queryFn: () => getUserData(user?.id as string),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: !!user?.id,
  })

  const mutation = useMutation({
    mutationFn: (updatedData: { fullname: string; profile: any }) =>
      updateUserProfile(user?.id as string, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] })
      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <div>Error loading profile</div>
  }

  const handleSave = async (formData: { fullname: string; profile: any }) => {
    mutation.mutate(formData)
  }

  return (
    <Card className="max-w-3xl mx-auto border-muted/40 shadow-sm rounded-none m-0">
      <CardHeader className="pb-4 pt-4 mt-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {!isEditing && (
            <Avatar className="h-20 w-20 border-2 border-muted">
              <AvatarImage
                src={data.profile?.avatar_url || "/placeholder.svg"}
                alt={data.fullname}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {data.fullname.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1">
            <CardTitle className="text-2xl">{data.fullname}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <User className="h-3 w-3 mr-1 opacity-70" />
              @{data.profile?.username || 'username'}
            </CardDescription>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" className="sm:self-start">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2 sm:self-start">
              <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={() => handleSave(data)}
                disabled={mutation.isPending}
                size="sm"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        {isEditing ? (
          <AccountEdit
            userData={data}
            onSave={handleSave}
          />
        ) : (
          <AccountDetails userData={data} />
        )}
      </CardContent>
    </Card>
  )
}
