"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import type { Department, UpdateDepartmentDto } from "@/types/department"
import { updateDepartment } from "@/lib/department"

interface DepartmentEditProps {
  department: Department
  onBack: () => void
  onUpdate: () => void
}

export function DepartmentEdit({ department, onBack, onUpdate }: DepartmentEditProps) {
  const [name, setName] = useState(department.name)
  const [description, setDescription] = useState(department.description)
  const [isActive, setIsActive] = useState(department.isActive)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Reset form when department changes
    setName(department.name)
    setDescription(department.description)
    setIsActive(department.isActive)
  }, [department])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    try {
      const updateData: UpdateDepartmentDto = {
        name,
        description,
        isActive,
      }

      await updateDepartment(department.id, updateData)
      setSuccess(true)

      // Notify parent component that update was successful
      onUpdate()

      // Redirect back to details after a short delay
      setTimeout(() => {
        onBack()
      }, 1500)
    } catch (err) {
      console.error("Error updating department:", err)
      setError("Failed to update department. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Department</h1>
        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
      
          <CardContent className="space-y-4 mt-5">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="bg-green-50 border-green-500 text-green-700">
                <AlertDescription>Department updated successfully!</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Department name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Department description"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                ID: <span className="font-mono">{department.id}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Created: {new Date(department.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Last Updated: {new Date(department.updatedAt).toLocaleString()}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
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
