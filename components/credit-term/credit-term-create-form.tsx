"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import type { CreateCreditTermDto } from "@/types/credit-term"
import { createCreditTerm } from "@/lib/credit-term"

interface CreditTermCreateFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  showCard?: boolean
}

export function CreditTermCreateForm({ onSuccess, onCancel, showCard = true }: CreditTermCreateFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [days, setDays] = useState<number>(30)
  const [isActive, setIsActive] = useState(true)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const resetForm = () => {
    setName("")
    setDescription("")
    setDays(30)
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
      if (days < 0) {
        throw new Error("Days must be a positive number")
      }

      const creditTermData: CreateCreditTermDto = {
        name: name.trim(),
        description: description.trim() || undefined,
        days,
        isActive,
      }

      console.log("Submitting credit term data:", creditTermData)
      const createdCreditTerm = await createCreditTerm(creditTermData)
      console.log("Credit term created successfully:", createdCreditTerm)
      setSuccess(true)
      resetForm()

      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 1500)
      }
    } catch (err) {
      console.error("Error creating credit term:", err)
      if (err instanceof Error) {
        if (err.message.includes("already exists")) {
          setError("A credit term with this name already exists. Please use a different name.")
        } else if (err.message.includes("Unique constraint")) {
          setError("A credit term with this information already exists.")
        } else {
          setError(err.message || "Failed to create credit term. Please try again.")
        }
      } else {
        setError("Failed to create credit term. Please try again.")
      }
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
          <AlertDescription>Credit term created successfully!</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
          <Button type="submit" disabled={isSubmitting || success || !name.trim()}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Credit Term"
            )}
          </Button>
        </div>
      </form>
    </>
  )

  if (showCard) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Credit Term</CardTitle>
          <CardDescription>Add a new payment term for customer transactions</CardDescription>
        </CardHeader>
        <CardContent>{formContent}</CardContent>
      </Card>
    )
  }

  return <div className="space-y-4">{formContent}</div>
}
