"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Customer } from "@/types/customer"

interface CustomerInfoCardProps {
  customer: Customer
  onChangeCustomer: () => void
}

export function CustomerInfoCard({ customer, onChangeCustomer }: CustomerInfoCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium">Customer Information</h4>
          <Button type="button" variant="outline" size="sm" onClick={onChangeCustomer}>
            Change Customer
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Name:</span> {customer.name}
          </div>
          <div>
            <span className="font-medium">Email:</span> {customer.email}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {customer.phone}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
