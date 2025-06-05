"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Plus } from "lucide-react"
import type { Department } from "@/types/department"
import { useState } from "react"
import { RoleDialog } from "@/components/department/role-dialog"

interface DepartmentDetailProps {
  department: Department
  onBack: () => void
  onEdit: () => void
}

export function DepartmentDetail({ department, onBack, onEdit }: DepartmentDetailProps) {
  // Add state for the role dialog
  const [isCreateRoleDialogOpen, setIsCreateRoleDialogOpen] = useState(false)

  // Add the handleCreateRole function
  const handleCreateRole = async (roleData: any) => {
    // This would typically call an API to create the role
    console.log("Creating role:", roleData)
    // After creating the role, you would typically refresh the department data
    alert("Role creation would be implemented here")
    setIsCreateRoleDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Department Details</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
            Back 
          </Button>
          <Button variant="outline" onClick={onEdit}>
            <Edit className="mr-1 h-4 w-4" /> Edit 
          </Button>
          <Button variant="outline" onClick={() => setIsCreateRoleDialogOpen(true)}>
            <Plus className="mr-1 h-4 w-4" /> Create Role
          </Button>
        </div>
      </div>

     <Card>
  <CardContent className="mt-5 space-y-6">
    {/* Department Information Section */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Department Information</h3>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <h4 className="text-sm font-medium">ID</h4>
          <p className="text-sm text-muted-foreground font-mono break-all">{department.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium">Name</h4>
          <p className="text-sm text-muted-foreground">{department.name}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium">Description</h4>
          <p className="text-sm text-muted-foreground">{department.description}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium">Status</h4>
          <p className="text-sm text-muted-foreground">{department.isActive ? "Active" : "Inactive"}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium">Created At</h4>
          <p className="text-sm text-muted-foreground">{new Date(department.createdAt).toLocaleString()}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium">Updated At</h4>
          <p className="text-sm text-muted-foreground">{new Date(department.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>

    <Separator className="dark:bg-slate-700" />

    {/* Department Roles Section */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Department Roles</h3>

      {department.roles.length > 0 ? (
        <div className="space-y-6">
          {department.roles.map((role) => (
            <div key={role.id} className="rounded-md border p-6 dark:border-slate-700">
              

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h5 className="text-sm font-medium">Role ID</h5>
                  <p className="text-sm text-muted-foreground font-mono break-all">{role.id}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium">Name</h5>
                  <p className="text-sm text-muted-foreground">{role.name}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium">Description</h5>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium">Status</h5>
                  <p className={`text-sm ${role.isActive ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
                    {role.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium">Created At</h5>
                  <p className="text-sm text-muted-foreground">{new Date(role.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium">Updated At</h5>
                  <p className="text-sm text-muted-foreground">{new Date(role.updatedAt).toLocaleString()}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium">Deleted At</h5>
                  <p className="text-sm text-muted-foreground">
                    {role.deletedAt ? new Date(role.deletedAt).toLocaleString() : "Not deleted"}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium">Created By</h5>
                  <p className="text-sm text-muted-foreground">{role.createdBy || "Not specified"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-32 bg-muted rounded-lg dark:bg-slate-800">
          <p className="text-muted-foreground">No roles found for this department</p>
        </div>
      )}
    </div>
  </CardContent>
</Card>


      <RoleDialog
        open={isCreateRoleDialogOpen}
        onOpenChange={setIsCreateRoleDialogOpen}
        onSubmit={handleCreateRole}
        title="Create Role"
        departmentId={department.id}
      />
    </div>
  )
}
