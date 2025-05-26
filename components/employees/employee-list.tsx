"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { Employee } from "@/types/employee"

interface EmployeeListProps {
  employees: Employee[]
  onView: (employeeId: string) => void
  onEdit: (employeeId: string) => void
  onDelete: (employee: Employee) => void
}

export function EmployeeList({ employees, onView, onEdit, onDelete }: EmployeeListProps) {
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
    <div className="rounded-md border dark:border-slate-700">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b dark:[&_tr]:border-slate-700">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:border-slate-700">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Username</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:border-slate-700"
              >
                <td className="p-4 align-middle font-medium">
                  {employee.firstName} {employee.lastName}
                </td>
                <td className="p-4 align-middle">{employee.email}</td>
                <td className="p-4 align-middle">{employee.role?.name || "—"}</td>
                <td className="p-4 align-middle">{employee.user?.username || "—"}</td>
                <td className="p-4 align-middle">
                  <span
                    className={
                      employee.isActive ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
                    }
                  >
                    {employee.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-4 align-middle">
                  <div className="flex space-x-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
