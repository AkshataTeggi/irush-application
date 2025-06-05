import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IndustryCreateForm } from "@/components/industry/industry-create-form"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Create Industry | iRUSH",
  description: "Create a new industry type",
}

export default function CreateIndustryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Industry</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/industries">
           <ArrowLeft className="mr-2 h-4 w-4" />
           Back </Link>
        </Button>
      </div>
      <div className="border rounded-md p-6">
        <IndustryCreateForm />
      </div>
    </div>
  )
}
