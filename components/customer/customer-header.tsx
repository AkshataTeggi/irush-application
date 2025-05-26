"use client"

import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

interface CustomerHeaderProps {
  onRefresh?: () => void
}

export function CustomerHeader({ onRefresh }: CustomerHeaderProps) {
  const router = useRouter()

  const handleAddCustomer = () => {
    router.push("/dashboard/customers/create")
  }

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Customers</h1>
      <div className="flex space-x-2">
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        )}
        <Button onClick={handleAddCustomer}>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>
    </div>
  )
}
