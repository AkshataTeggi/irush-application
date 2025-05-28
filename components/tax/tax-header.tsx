import { Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function TaxHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tax Management</h1>
      </div>
      <Button asChild>
        <Link href="/dashboard/tax/create">
          <Plus className="mr-2 h-4 w-4" />
          Add Tax
        </Link>
      </Button>
    </div>
  )
}
