"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RFQ_STATUSES } from "@/types/rfq"

interface BasicInfoSectionProps {
  title: string
  setTitle: (title: string) => void
  quantity: string
  setQuantity: (quantity: string) => void
  status: string
  setStatus: (status: string) => void
  description: string
  setDescription: (description: string) => void
  formErrors: { [key: string]: string }
  disabled?: boolean
}

export function BasicInfoSection({
  title,
  setTitle,
  quantity,
  setQuantity,
  status,
  setStatus,
  description,
  setDescription,
  formErrors,
  disabled = false,
}: BasicInfoSectionProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            Project Title <span className="text-red-600">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter project title"
            required
            disabled={disabled}
          />
          {formErrors.title && <p className="text-red-500 text-xs">{formErrors.title}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus} disabled={disabled}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {RFQ_STATUSES.map((statusOption) => (
                <SelectItem key={statusOption.value} value={statusOption.value}>
                  {statusOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          rows={4}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
