"use client"

import { useState, useEffect } from "react"
import { DeleteConfirmDialog } from "@/components/department/delete-confirm-dialog"
import { fetchEmployees, deleteEmployee } from "@/lib/employee"
import type { Employee } from "@/types/employee"
import { EmployeeError } from "@/components/employees/employee-error"
import { EmployeeHeader } from "@/components/employees/employee-header"
import { EmployeeLoading } from "@/components/employees/employee-loading"
import { EmployeeTabs } from "@/components/employees/employee-tabs"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchEmployees()
      setEmployees(data)
    } catch (err) {
      setError("Error loading employees. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return

    try {
      await deleteEmployee(selectedEmployee.id)
      await loadEmployees()
      setIsDeleteDialogOpen(false)
    } catch (err) {
      console.error(err)
      setError("Failed to delete employee. Please try again.")
    }
  }

  const handleDeleteEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDeleteDialogOpen(true)
  }

  const filteredEmployees = employees.filter((employee) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return employee.isActive
    if (activeTab === "inactive") return !employee.isActive
    return true
  })

  if (isLoading) {
    return <EmployeeLoading />
  }

  if (error) {
    return <EmployeeError error={error} />
  }

  return (
    <div className="space-y-6">
      <EmployeeHeader />

      <EmployeeTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        employees={filteredEmployees}
        onView={() => {}} // Now handled by router navigation
        onEdit={() => {}} // Now handled by router navigation
        onDelete={handleDeleteEmployeeClick}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteEmployee}
        title="Delete Employee"
        description={`Are you sure you want to delete ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}? This action cannot be undone.`}
      />
    </div>
  )
}
