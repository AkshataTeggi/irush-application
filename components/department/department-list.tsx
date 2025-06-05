"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { Department } from "@/types/department"

interface DepartmentListProps {
  departments: Department[]
  onViewRoles: (departmentId: string) => void
  onEdit: (departmentId: string) => void
  onDelete: (department: Department) => void
}

export function DepartmentList({ departments, onViewRoles, onEdit, onDelete }: DepartmentListProps) {
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
    <div className="rounded-md border dark:border-slate-700">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b dark:[&_tr]:border-slate-700">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:border-slate-700">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created At</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Updated At</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {departments.map((department) => (
              <tr
                key={department.id}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:border-slate-700"
              >
                <td className="p-4 align-middle font-medium">{department.name}</td>
                <td className="p-4 align-middle max-w-[250px] truncate" title={department.description}>
                  {department.description}
                </td>
                <td className="p-4 align-middle">{department.isActive ? "Active" : "Inactive"}</td>
                <td className="p-4 align-middle ">{new Date(department.createdAt).toLocaleString()}</td>
                <td className="p-4 align-middle  ">{new Date(department.updatedAt).toLocaleString()}</td>

                <td className="p-4 align-middle">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewClick(department.id)}>
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(department.id)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                   
                      onClick={() => onDelete(department)}
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
