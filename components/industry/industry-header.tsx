import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface IndustryHeaderProps {
  title?: string
}

export function IndustryHeader({ title = "Industries" }: IndustryHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <Link href="/dashboard/industries/create">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Industry
        </Button>
      </Link>
    </div>
  )
}
