"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DepartmentCreateForm } from "@/components/department/department-create-form"

export default function CreateDepartmentPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/dashboard/departments")
  }

  const handleCancel = () => {
    router.push("/dashboard/departments")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create Department</h1>
        <Button variant="outline" onClick={handleCancel}>
          Back to Departments
        </Button>
      </div>

      <DepartmentCreateForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  )
}
