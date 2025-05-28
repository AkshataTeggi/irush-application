import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function VendorHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
      </div>
      <Button asChild>
        <Link href="/dashboard/vendors/create">
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Link>
      </Button>
    </div>
  )
}
