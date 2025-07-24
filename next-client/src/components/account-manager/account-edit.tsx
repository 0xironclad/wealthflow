"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AvatarUpload } from "./avatar-upload"


const profileSchema = z.object({
  fullname: z.string().min(2).max(50),
  profile: z.object({
    username: z.string().min(2).max(30),
    bio: z.string().max(500),
    website: z.string().url().optional().or(z.literal("")),
  }),
})

interface AccountEditProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userData: any
  onSave: (data: z.infer<typeof profileSchema>) => void
}

export function AccountEdit({ userData, onSave }: AccountEditProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  console.log(avatarFile)

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullname: userData.fullname,
      profile: {
        username: userData.profile?.username || "",
        bio: userData.profile?.bio || "",
        website: userData.profile?.website || "",
      },
    },
  })

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setAvatarPreview(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Edit Profile</h3>
        <p className="text-sm text-muted-foreground">Update your account details and personal information.</p>
      </div>

      <div className="flex justify-center mb-6">
        <AvatarUpload
          currentImageUrl="/placeholder.svg?height=80&width=80"
          name={userData.fullname}
          onFileChange={handleAvatarChange}
          previewUrl={avatarPreview}
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profile.username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profile.bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profile.website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}
