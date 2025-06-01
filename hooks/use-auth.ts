"use client"

import { useState, useEffect } from "react"
import { getUser } from "@/lib/auth"
import type { User } from "@/types/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = getUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const userRole = user?.role?.toLowerCase()
  const isAdmin = userRole === "admin"
  const isSalesman = userRole === "salesman"
  const isAuthenticated = !!user

  return {
    user,
    isLoading,
    isAdmin,
    isSalesman,
    isAuthenticated,
    userRole,
    refreshUser: () => {
      const currentUser = getUser()
      setUser(currentUser)
    },
  }
}
