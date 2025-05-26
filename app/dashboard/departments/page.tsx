"use client"

import { useState, useEffect } from "react"
import { DepartmentHeader } from "@/components/department/department-header"
import { DepartmentTabs } from "@/components/department/department-tabs"
import { DeleteConfirmDialog } from "@/components/department/delete-confirm-dialog"
import { DepartmentLoading } from "@/components/department/department-loading"
import { DepartmentError } from "@/components/department/department-error"
import { fetchDepartments, deleteDepartment } from "@/lib/department"
import type { Department } from "@/types/department"

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    loadDepartments()
  }, [])

  const loadDepartments = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchDepartments()
      setDepartments(data)
    } catch (err) {
      setError("Error loading departments. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) return

    try {
      await deleteDepartment(selectedDepartment.id)
      await loadDepartments()
      setIsDeleteDialogOpen(false)
    } catch (err) {
      console.error(err)
      setError("Failed to delete department. Please try again.")
    }
  }

  const handleDeleteDepartmentClick = (department: Department) => {
    setSelectedDepartment(department)
    setIsDeleteDialogOpen(true)
  }

  const filteredDepartments = departments.filter((dept) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return dept.isActive
    if (activeTab === "inactive") return !dept.isActive
    return true
  })

  if (isLoading) {
    return <DepartmentLoading />
  }

  if (error) {
    return <DepartmentError error={error} />
  }

  return (
    <div className="space-y-6">
      <DepartmentHeader />

      <DepartmentTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        departments={filteredDepartments}
        onViewRoles={() => {}} // Now handled by router navigation
        onEdit={() => {}} // Now handled by router navigation
        onDelete={handleDeleteDepartmentClick}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteDepartment}
        title="Delete Department"
        description={`Are you sure you want to delete ${selectedDepartment?.name}? This action cannot be undone.`}
      />
    </div>
  )
}
