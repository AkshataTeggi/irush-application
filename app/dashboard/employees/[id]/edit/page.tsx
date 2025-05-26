"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { fetchEmployeeById } from "@/lib/employee"
import type { Employee } from "@/types/employee"
import { EmployeeEdit } from "@/components/employees/employee-edit"
import { EmployeeError } from "@/components/employees/employee-error"
import { EmployeeLoading } from "@/components/employees/employee-loading"

export default function EmployeeEditPage() {
  const router = useRouter()
  const params = useParams()
  const employeeId = params.id as string

  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (employeeId) {
      loadEmployee()
    }
  }, [employeeId])

  const loadEmployee = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchEmployeeById(employeeId)
      setEmployee(data)
    } catch (err) {
      setError("Error loading employee. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push(`/dashboard/employees/${employeeId}`)
  }

  const handleUpdate = () => {
    // Redirect to employee detail page after successful update
    router.push(`/dashboard/employees/${employeeId}`)
  }

  if (isLoading) {
    return <EmployeeLoading />
  }

  if (error) {
    return <EmployeeError error={error} />
  }

  if (!employee) {
    return <EmployeeError error="Employee not found" />
  }

  return <EmployeeEdit employee={employee} onBack={handleBack} onUpdate={handleUpdate} />
}
