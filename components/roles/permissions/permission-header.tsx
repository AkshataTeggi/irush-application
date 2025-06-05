import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function PermissionHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Permission</h1>
      </div>
      <Button asChild>
        <Link href="/dashboard/roles">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>
    </div>
  )
}
