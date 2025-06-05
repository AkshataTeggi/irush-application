"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface RoleErrorProps {
  error: Error
  onRetry?: () => void
}

export function RoleError({ error, onRetry }: RoleErrorProps) {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading roles</AlertTitle>
        <AlertDescription className="mt-2">
          {error.message || "An unexpected error occurred while loading roles."}
        </AlertDescription>
      </Alert>

      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  )
}
