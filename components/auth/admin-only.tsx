"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { getUser } from "@/lib/auth"
import type { User } from "@/types/auth"

interface AdminOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = getUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return null // Don't show anything while loading
  }

  if (!user) {
    return fallback
  }

  // Check if user is admin - using the role string directly
  const isAdmin = user.role?.toLowerCase() === "admin"

  if (!isAdmin) {
    return fallback
  }

  return <>{children}</>
}
