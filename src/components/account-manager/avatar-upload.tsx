"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface AvatarUploadProps {
  currentImageUrl: string
  name: string
  onFileChange: (file: File | null) => void
  previewUrl: string | null
}

export function AvatarUpload({ currentImageUrl, name, onFileChange, previewUrl }: AvatarUploadProps) {
  const [isHovering, setIsHovering] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onFileChange(file)
  }

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onFileChange(null)
  }

  return (
    <div className="relative">
      <div
        className="relative group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Avatar className="h-24 w-24 border-2 border-muted cursor-pointer">
          <AvatarImage src={previewUrl || currentImageUrl} alt={name} className="object-cover" />
          <AvatarFallback className="bg-primary/10 text-primary text-2xl">
            {name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Overlay with edit icon */}
        <div
          className={`absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-opacity ${
            isHovering ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* File input (hidden) */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {/* Preview indicator and remove button */}
      {previewUrl && (
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">New image selected</span>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={handleRemoveFile}>
            <X className="h-3 w-3" />
            <span className="sr-only">Remove image</span>
          </Button>
        </div>
      )}
    </div>
  )
}
