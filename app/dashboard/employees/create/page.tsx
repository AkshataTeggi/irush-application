"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { EmployeeCreateForm } from "@/components/employees/employee-create-form"

export default function CreateEmployeePage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/dashboard/employees")
  }

  const handleCancel = () => {
    router.push("/dashboard/employees")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create Employee</h1>
        <Button variant="outline" onClick={handleCancel}>
          Back to Employees
        </Button>
      </div>

      <EmployeeCreateForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  )
}
