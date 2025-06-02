"use client"

import { Mail, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CustomerSearchDialog } from "@/components/rfq/customer-search-dialog"
import type { Customer } from "@/types/customer"

interface CustomerSelectionStepProps {
  isCustomerSearchOpen: boolean
  setIsCustomerSearchOpen: (open: boolean) => void
  onCustomerSelect: (customer: Customer) => void
  error: string | null
}

export function CustomerSelectionStep({
  isCustomerSearchOpen,
  setIsCustomerSearchOpen,
  onCustomerSelect,
  error,
}: CustomerSelectionStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select a Customer</h3>
        <p className="text-sm text-muted-foreground">
          First, select a customer for this RFQ. You'll be able to fill in the RFQ details after selecting a customer.
        </p>

        <div className="flex space-x-2">
          <Button type="button" onClick={() => setIsCustomerSearchOpen(true)} className="flex-1">
            <Mail className="mr-2 h-4 w-4" />
            Search for a Customer
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <CustomerSearchDialog
        open={isCustomerSearchOpen}
        onOpenChange={setIsCustomerSearchOpen}
        onSelectCustomer={onCustomerSelect}
      />
    </div>
  )
}
