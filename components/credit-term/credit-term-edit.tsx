"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import type { CreditTerm, UpdateCreditTermDto } from "@/types/credit-term"
import { updateCreditTerm } from "@/lib/credit-term"

interface CreditTermEditProps {
  creditTerm: CreditTerm
  onBack: () => void
  onUpdate: () => void
}

export function CreditTermEdit({ creditTerm, onBack, onUpdate }: CreditTermEditProps) {
  const [name, setName] = useState(creditTerm.name)
  const [description, setDescription] = useState(creditTerm.description || "")
  const [days, setDays] = useState(creditTerm.days)
  const [isActive, setIsActive] = useState(creditTerm.isActive)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    try {
      if (days < 0) {
        throw new Error("Days must be a positive number")
      }

      const updateData: UpdateCreditTermDto = {
        name: name.trim(),
        description: description.trim() || undefined,
        days,
        isActive,
      }

      console.log("Updating credit term with data:", updateData)
      await updateCreditTerm(creditTerm.id, updateData)
      setSuccess(true)

      onUpdate()

      setTimeout(() => {
        onBack()
      }, 1500)
    } catch (err) {
      console.error("Error updating credit term:", err)
      if (err instanceof Error) {
        if (err.message.includes("already exists")) {
          setError("A credit term with this name already exists. Please use a different name.")
        } else if (err.message.includes("Unique constraint")) {
          setError("A credit term with this information already exists.")
        } else if (err.message.includes("Credit term not found")) {
          setError("Credit term not found. It may have been deleted.")
        } else {
          setError(err.message || "Failed to update credit term. Please try again.")
        }
      } else {
        setError("Failed to update credit term. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
           <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Credit Term</h1>
        </div>
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Details
        </Button>
      </div>


      <Card>
        <form onSubmit={handleSubmit}>
         
          <CardContent className="space-y-6 mt-5">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
                <AlertDescription>Credit term updated successfully!</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="creditTermId">Credit Term ID </Label>
              <Input id="creditTermId" value={creditTerm.id} disabled className="bg-muted font-mono" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Net 30, Net 60"
                  required
                  disabled={isSubmitting || success}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="days">Payment Days *</Label>
                <Input
                  id="days"
                  type="number"
                  min="0"
                  value={days}
                  onChange={(e) => setDays(Number.parseInt(e.target.value) || 0)}
                  placeholder="30"
                  required
                  disabled={isSubmitting || success}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description of the credit terms..."
                disabled={isSubmitting || success}
                rows={3}
              />
            </div>

            {/* <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
                disabled={isSubmitting || success}
              />
              <Label htmlFor="isActive">Active</Label>
            </div> */}

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">System Information (Read-only)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Created At</Label>
                  <Input value={new Date(creditTerm.createdAt).toLocaleString()} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Updated At</Label>
                  <Input value={new Date(creditTerm.updatedAt).toLocaleString()} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Created By</Label>
                  <Input value={creditTerm.createdBy || "System"} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Updated By</Label>
                  <Input value={creditTerm.updatedBy || "—"} disabled className="bg-muted" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || success || !name.trim()}>
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
