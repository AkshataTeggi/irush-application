"use client"

import type React from "react"
import Link from "next/link"
import { ArrowLeft, Edit, Calendar, Hash, Building, Layers, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import type { Role } from "@/types/department"

interface RoleDetailProps {
  role: Role
  onBack: () => void
}

export const RoleDetail: React.FC<RoleDetailProps> = ({ role, onBack }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Details</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/dashboard/roles/${role.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Role
            </Link>
          </Button>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Roles
          </Button>
        </div>
      </div>

      {/* Role Information Card */}
      <Card>
        <CardContent className="space-y-6 mt-5">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
              <label className="text-sm font-medium text-muted-foreground">Role ID</label>
              <p className="font-mono text-xs">{role.id}</p>
            </div>
              <div>
              <label className="text-sm font-medium text-muted-foreground">Department Name</label>
              <p>{role.departmentName || "None"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Role Name</label>
              <p>{role.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Permissions</label>
              <p>{Array.isArray(role.permissions) && role.permissions.length > 0
                    ? role.permissions.map((perm) => perm.name).join(", ")
                    : "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                {role.isActive ? (
                  <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                    <CheckCircle className="h-4 w-4" /> Active
                  </span>
                ) : (
                  "Inactive"
                )}
              </div>
            </div>
            
            
          </div>

          {/* Department Info */}
          <div className="grid grid-cols-1 b gap-6">
            
          <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p>{role.description || "No description provided"}</p>
            </div>
           
          </div>

          {/* System Information */}
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Created At</p>
                <p className="text-muted-foreground">{new Date(role.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Last Updated</p>
                <p className="text-muted-foreground">{new Date(role.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
            
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
