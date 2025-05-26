"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import type { CreateEmployeeDto } from "@/types/employee"
import { createEmployee } from "@/lib/employee"
import { fetchRoles, type Role } from "@/lib/roles"

interface EmployeeCreateFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  showCard?: boolean
}

export function EmployeeCreateForm({ onSuccess, onCancel, showCard = true }: EmployeeCreateFormProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [roleId, setRoleId] = useState("")
  const [isActive, setIsActive] = useState(true)
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
    } catch (err) {
      console.error("Error loading roles:", err)
      setError("Failed to load roles. Please try again.")
    }
  }

  const resetForm = () => {
    setFirstName("")
    setLastName("")
    setEmail("")
    setRoleId("")
    setIsActive(true)
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    try {
      const employeeData: CreateEmployeeDto = {
        firstName,
        lastName,
        email,
        roleId,
        isActive,
        createdBy: null, // You can set this to current user ID if available
      }

      await createEmployee(employeeData)
      setSuccess(true)
      resetForm()

      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 1500)
      }
    } catch (err) {
      console.error("Error creating employee:", err)
      setError("Failed to create employee. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    resetForm()
    if (onCancel) {
      onCancel()
    }
  }

  const formContent = (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mb-4 bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
          <AlertDescription>Employee created successfully!</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              required
              disabled={isSubmitting || success}
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
              disabled={isSubmitting || success}
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
            disabled={isSubmitting || success}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={roleId} onValueChange={setRoleId} disabled={isSubmitting || success}>
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

        <div className="flex items-center space-x-2">
          <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} disabled={isSubmitting || success} />
          <Label htmlFor="isActive">Active</Label>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || !roleId || success}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Employee"
            )}
          </Button>
        </div>
      </form>
    </>
  )

  if (showCard) {
    return (
      <Card >
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
          <CardDescription>
            Create a new employee by filling out the form below. A user account can be created separately if needed.
          </CardDescription>
        </CardHeader>
        <CardContent>{formContent}</CardContent>
      </Card>
    )
  }

  return <div className="space-y-4">{formContent}</div>
}
