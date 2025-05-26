"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DepartmentEdit } from "@/components/department/department-edit"
import { DepartmentLoading } from "@/components/department/department-loading"
import { DepartmentError } from "@/components/department/department-error"
import { fetchDepartmentById } from "@/lib/department"
import type { Department } from "@/types/department"

export default function DepartmentEditPage() {
  const router = useRouter()
  const params = useParams()
  const departmentId = params.id as string

  const [department, setDepartment] = useState<Department | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (departmentId) {
      loadDepartment()
    }
  }, [departmentId])

  const loadDepartment = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchDepartmentById(departmentId)
      setDepartment(data)
    } catch (err) {
      setError("Error loading department. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push(`/dashboard/departments/${departmentId}`)
  }

  const handleUpdate = () => {
    // Redirect to department detail page after successful update
    router.push(`/dashboard/departments/${departmentId}`)
  }

  if (isLoading) {
    return <DepartmentLoading />
  }

  if (error) {
    return <DepartmentError error={error} />
  }

  if (!department) {
    return <DepartmentError error="Department not found" />
  }

  return <DepartmentEdit department={department} onBack={handleBack} onUpdate={handleUpdate} />
}
