"use client"

import { Button } from "@/components/ui/button"
import { Mail, UserCog, Calendar, User, AtSign } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Employee } from "@/types/employee"

interface EmployeeListMobileProps {
  employees: Employee[]
  onView: (employeeId: string) => void
  onEdit: (employeeId: string) => void
  onDelete: (employee: Employee) => void
}

export function EmployeeListMobile({ employees, onView, onEdit, onDelete }: EmployeeListMobileProps) {
  const router = useRouter()

  if (employees.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-muted rounded-lg dark:bg-slate-800">
        <p className="text-muted-foreground">No employees found</p>
      </div>
    )
  }

  const handleViewClick = (employeeId: string) => {
    router.push(`/dashboard/employees/${employeeId}`)
  }

  const handleEditClick = (employeeId: string) => {
    router.push(`/dashboard/employees/${employeeId}/edit`)
  }

  return (
    <div className="space-y-4">
      {employees.map((employee) => (
        <div key={employee.id} className="rounded-lg border p-4 dark:border-slate-700 bg-card">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">
                {employee.firstName} {employee.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">{employee.email}</p>
            </div>
            <span
              className={`text-sm ${employee.isActive ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
            >
              {employee.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="mr-2 h-4 w-4" />
              <span>{employee.email}</span>
            </div>
            {employee.user?.username && (
              <div className="flex items-center text-sm text-muted-foreground">
                <AtSign className="mr-2 h-4 w-4" />
                <span>{employee.user.username}</span>
              </div>
            )}
            <div className="flex items-center text-sm text-muted-foreground">
              <UserCog className="mr-2 h-4 w-4" />
              <span>{employee.role?.name || "No Role"}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <Calendar className="mr-1 h-3 w-3" />
              <span>Created: {new Date(employee.createdAt).toLocaleString()}</span>
            </div>
            {employee.createdBy && (
              <div className="flex items-center text-xs text-muted-foreground">
                <User className="mr-1 h-3 w-3" />
                <span>Created by: {employee.createdBy}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleViewClick(employee.id)}>
              View
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleEditClick(employee.id)}>
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              onClick={() => onDelete(employee)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
