"use client"

import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Customer } from "@/types/customer"

interface FormHeaderProps {
  customer: Customer | null
  onBackToCustomerSelection: () => void
  isLoading?: boolean
}

export function FormHeader({ customer, onBackToCustomerSelection, isLoading = false }: FormHeaderProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button type="button" variant="ghost" size="sm" onClick={onBackToCustomerSelection}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h3 className="text-lg font-semibold">Create RFQ for {customer?.name}</h3>
        </div>

        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading form options...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Button type="button" variant="ghost" size="sm" onClick={onBackToCustomerSelection}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Button>
      <h3 className="text-lg font-semibold">Create RFQ for {customer?.name}</h3>
    </div>
  )
}
