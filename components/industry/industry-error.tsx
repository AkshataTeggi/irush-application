"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface IndustryErrorProps {
  error: Error
  reset: () => void
}

export function IndustryError({ error, reset }: IndustryErrorProps) {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
      <div className="flex items-center space-x-2 text-destructive">
        <AlertCircle className="h-6 w-6" />
        <h3 className="font-semibold">Something went wrong!</h3>
      </div>
      <p className="text-sm text-muted-foreground">{error.message || "Failed to load industries"}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
