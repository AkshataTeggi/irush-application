

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { RoleCreateForm } from "@/components/roles/role-create-form"

export default function RoleCreatePage() {
  return (
    <div className="space-y-6">
      {/* Heading and Back button in one row */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create Role</h1>

        <Link href="/dashboard/roles">
          <Button>
        <ArrowLeft className="mr-2 h-4 w-4" />

            Back</Button>
        </Link>
      </div>

      {/* Form below */}
      <RoleCreateForm />
    </div>
  )
}
