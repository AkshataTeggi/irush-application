"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export function EmployeeHeader() {
  const router = useRouter()

  const handleAddEmployee = () => {
    router.push("/dashboard/employees/create")
  }

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Employees</h1>
      <Button onClick={handleAddEmployee}>
        <Plus className="mr-2 h-4 w-4" /> Add Employee
      </Button>
    </div>
  )
}
