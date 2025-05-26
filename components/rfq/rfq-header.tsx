"use client"

import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

interface RFQHeaderProps {
  onRefresh?: () => void
}

export function RFQHeader({ onRefresh }: RFQHeaderProps) {
  const router = useRouter()

  const handleAddRFQ = () => {
    router.push("/dashboard/rfq/create")
  }

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Request for Quotations</h1>
      <div className="flex space-x-2">
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        )}
        <Button onClick={handleAddRFQ}>
          <Plus className="mr-2 h-4 w-4" /> Create RFQ
        </Button>
      </div>
    </div>
  )
}
