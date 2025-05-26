"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, RefreshCw, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Department } from "@/types/department"

interface DepartmentListMobileProps {
  departments: Department[]
  onViewRoles: (departmentId: string) => void
  onEdit: (departmentId: string) => void
  onDelete: (department: Department) => void
}

export function DepartmentListMobile({ departments, onViewRoles, onEdit, onDelete }: DepartmentListMobileProps) {
  const router = useRouter()

  if (departments.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-muted rounded-lg dark:bg-slate-800">
        <p className="text-muted-foreground">No departments found</p>
      </div>
    )
  }

  const handleViewClick = (departmentId: string) => {
    router.push(`/dashboard/departments/${departmentId}`)
  }

  const handleEditClick = (departmentId: string) => {
    router.push(`/dashboard/departments/${departmentId}/edit`)
  }

  return (
    <div className="space-y-4">
      {departments.map((department) => (
        <div key={department.id} className="rounded-lg border p-4 dark:border-slate-700 bg-card">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{department.name}</h3>
            <Badge variant={department.isActive ? "default" : "secondary"}>
              {department.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{department.description}</p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-xs text-muted-foreground">
              <Info className="mr-1 h-3 w-3" />
              <span className="truncate max-w-[250px]" title={department.id}>
                ID: {department.id}
              </span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              <span>Created: {new Date(department.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <RefreshCw className="mr-1 h-3 w-3" />
              <span>Updated: {new Date(department.updatedAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center text-xs">
              <Users className="mr-1 h-3 w-3" />
              <span>
                {department.roles.length} Role{department.roles.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleViewClick(department.id)}>
              View
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleEditClick(department.id)}>
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              onClick={() => onDelete(department)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
