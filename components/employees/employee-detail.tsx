"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Edit } from "lucide-react"
import type { Employee } from "@/types/employee"

interface EmployeeDetailProps {
  employee: Employee
  onBack: () => void
  onEdit: () => void
}

export function EmployeeDetail({ employee, onBack, onEdit }: EmployeeDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Employee Details</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onBack}>
            Back to Employees
          </Button>
          <Button onClick={onEdit}>
            <Edit className="mr-1 h-4 w-4" /> Edit Employee
          </Button>
        </div>
      </div>

      <Card>
     
        <CardContent className="mt-5 space-y-6">
          {/* Employee Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Employee Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium">ID</h4>
                <p className="text-sm text-muted-foreground font-mono break-all">{employee.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">First Name</h4>
                <p className="text-sm text-muted-foreground">{employee.firstName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Last Name</h4>
                <p className="text-sm text-muted-foreground">{employee.lastName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Email</h4>
                <p className="text-sm text-muted-foreground">{employee.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Status</h4>
                <p className="text-sm text-muted-foreground">{employee.isActive ? "Active" : "Inactive"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Created At</h4>
                <p className="text-sm text-muted-foreground">{new Date(employee.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Updated At</h4>
                <p className="text-sm text-muted-foreground">{new Date(employee.updatedAt).toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Role ID</h4>
                <p className="text-sm text-muted-foreground font-mono">{employee.roleId}</p>
              </div>
            </div>
          </div>

          <Separator className="dark:bg-slate-700" />

          {/* Role Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Role Information</h3>
            {employee.role ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium">ID</h4>
                  <p className="text-sm text-muted-foreground font-mono break-all">{employee.role.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Name</h4>
                  <p className="text-sm text-muted-foreground">{employee.role.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">{employee.role.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Department ID</h4>
                  <p className="text-sm text-muted-foreground font-mono">{employee.role.departmentId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Is Active</h4>
                  <p
                    className={`text-sm ${employee.role.isActive ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
                  >
                    {employee.role.isActive ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Created At</h4>
                  <p className="text-sm text-muted-foreground">{new Date(employee.role.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Updated At</h4>
                  <p className="text-sm text-muted-foreground">{new Date(employee.role.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-20 bg-muted rounded-lg dark:bg-slate-800">
                <p className="text-muted-foreground">No role assigned</p>
              </div>
            )}
          </div>

          <Separator className="dark:bg-slate-700" />

          {/* User Account Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Account Information</h3>
            {employee.user ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium">ID</h4>
                  <p className="text-sm text-muted-foreground font-mono break-all">{employee.user.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Name</h4>
                  <p className="text-sm text-muted-foreground">{employee.user.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Username</h4>
                  <p className="text-sm text-muted-foreground">{employee.user.username}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Employee ID</h4>
                  <p className="text-sm text-muted-foreground font-mono">{employee.user.employeeId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Email</h4>
                  <p className="text-sm text-muted-foreground">{employee.user.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Phone</h4>
                  <p className="text-sm text-muted-foreground">{employee.user.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Status</h4>
                  <p
                    className={`text-sm ${employee.user.status === "active" ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
                  >
                    {employee.user.status}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Created At</h4>
                  <p className="text-sm text-muted-foreground">{new Date(employee.user.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Updated At</h4>
                  <p className="text-sm text-muted-foreground">{new Date(employee.user.updatedAt).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Role ID</h4>
                  <p className="text-sm text-muted-foreground font-mono">{employee.user.roleId}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-20 bg-muted rounded-lg dark:bg-slate-800">
                <p className="text-muted-foreground">No user account associated with this employee</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
