"use client"

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
     
      </div>
    )
  }


}
