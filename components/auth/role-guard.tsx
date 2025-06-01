"use client"

import type React from "react"
import { useAuth } from "@/hooks/use-auth"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-600">Authentication Required</h2>
        <p className="text-muted-foreground mt-2">Please log in to access this page.</p>
      </div>
    )
  }

  // Check if user has any of the allowed roles (case insensitive)
  const hasAllowedRole = allowedRoles.some((role) => user.role?.toLowerCase() === role.toLowerCase())

  if (!hasAllowedRole) {
    return (
      fallback || (
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-muted-foreground mt-2">You don't have permission to access this page.</p>
          <p className="text-sm text-muted-foreground mt-1">Required roles: {allowedRoles.join(", ")}</p>
        </div>
      )
    )
  }

  return <>{children}</>
}
