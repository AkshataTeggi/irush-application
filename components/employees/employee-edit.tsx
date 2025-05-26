"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import type { Employee, UpdateEmployeeDto } from "@/types/employee"
import { updateEmployee } from "@/lib/employee"
import { fetchRoles, type Role } from "@/lib/roles"
import { Separator } from "@/components/ui/separator"

interface EmployeeEditProps {
  employee: Employee
  onBack: () => void
  onUpdate: () => void
}

export function EmployeeEdit({ employee, onBack, onUpdate }: EmployeeEditProps) {
  const [firstName, setFirstName] = useState(employee.firstName)
  const [lastName, setLastName] = useState(employee.lastName)
  const [email, setEmail] = useState(employee.email)
  const [roleId, setRoleId] = useState(employee.roleId)
  const [isActive, setIsActive] = useState(employee.isActive)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      const data = await fetchRoles()
      setRoles(data)

      // No need to find department since we're working directly with roles
    } catch (err) {
      console.error("Error loading roles:", err)
      setError("Failed to load roles. Please try again.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    try {
      const updateData: UpdateEmployeeDto = {
        firstName,
        lastName,
        email,
        roleId,
        isActive,
        updatedBy: null, // You can set this to current user ID if available
      }

      await updateEmployee(employee.id, updateData)
      setSuccess(true)

      // Notify parent component that update was successful
      onUpdate()

      // Redirect back to details after a short delay
      setTimeout(() => {
        onBack()
      }, 1500)
    } catch (err) {
      console.error("Error updating employee:", err)
      setError("Failed to update employee. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Employee</h1>
        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
            <CardDescription>Update the employee details below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
                <AlertDescription>Employee updated successfully!</AlertDescription>
              </Alert>
            )}

            {/* Employee Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Employee Information</h3>

              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID (Read-only)</Label>
                <Input id="employeeId" value={employee.id} disabled className="bg-muted" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@company.com"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Created At (Read-only)</Label>
                  <Input value={new Date(employee.createdAt).toLocaleString()} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Updated At (Read-only)</Label>
                  <Input value={new Date(employee.updatedAt).toLocaleString()} disabled className="bg-muted" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current Role ID (Read-only)</Label>
                <Input value={employee.roleId} disabled className="bg-muted font-mono" />
              </div>
            </div>

            <Separator className="dark:bg-slate-700" />

            {/* Role Selection Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Role Assignment</h3>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={roleId} onValueChange={setRoleId}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{role.name}</span>
                          <span className="text-xs text-muted-foreground">{role.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="dark:bg-slate-700" />

            {/* Current Role Information (Read-only) */}
            {employee.role && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Current Role Information (Read-only)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Role ID</Label>
                    <Input value={employee.role.id} disabled className="bg-muted font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label>Role Name</Label>
                    <Input value={employee.role.name} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Role Description</Label>
                    <Input value={employee.role.description} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Department ID</Label>
                    <Input value={employee.role.departmentId} disabled className="bg-muted font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label>Role Status</Label>
                    <Input value={employee.role.isActive ? "Active" : "Inactive"} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Role Created At</Label>
                    <Input value={new Date(employee.role.createdAt).toLocaleString()} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Role Updated At</Label>
                    <Input value={new Date(employee.role.updatedAt).toLocaleString()} disabled className="bg-muted" />
                  </div>
                </div>
              </div>
            )}

            <Separator className="dark:bg-slate-700" />

            {/* User Account Information (Read-only) */}
            {employee.user && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Associated User Account (Read-only)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>User ID</Label>
                    <Input value={employee.user.id} disabled className="bg-muted font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label>User Name</Label>
                    <Input value={employee.user.name} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input value={employee.user.username} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Employee ID Reference</Label>
                    <Input value={employee.user.employeeId} disabled className="bg-muted font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label>User Email</Label>
                    <Input value={employee.user.email} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={employee.user.phone} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>User Status</Label>
                    <Input value={employee.user.status} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>User Role ID</Label>
                    <Input value={employee.user.roleId} disabled className="bg-muted font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label>User Created At</Label>
                    <Input value={new Date(employee.user.createdAt).toLocaleString()} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>User Updated At</Label>
                    <Input value={new Date(employee.user.updatedAt).toLocaleString()} disabled className="bg-muted" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !roleId}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
