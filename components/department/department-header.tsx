"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export function DepartmentHeader() {
  const router = useRouter()

  const handleAddDepartment = () => {
    router.push("/dashboard/departments/create")
  }

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Departments</h1>
      <Button onClick={handleAddDepartment}>
        <Plus className="mr-2 h-4 w-4" /> Add Department
      </Button>
    </div>
  )
}
