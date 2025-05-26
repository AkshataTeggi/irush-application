"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface CreditTermErrorProps {
  message?: string
  onRetry?: () => void
}

export function CreditTermError({ message = "Failed to load credit terms", onRetry }: CreditTermErrorProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Credit Terms</h1>
      </div>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="mt-2">
          {message}
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="mt-2 ml-0">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  )
}
