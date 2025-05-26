"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, User, Mail, Building } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import type { RFQ, UpdateRFQDto } from "@/types/rfq"
import { updateRFQ } from "@/lib/rfq"
import { RFQ_STATUSES } from "@/types/rfq"
import { Service, Specification, fetchServices, fetchSpecifications } from "@/lib/rfq-option"

interface RFQEditProps {
  rfq: RFQ
  onBack: () => void
  onUpdate: () => void
}

export function RFQEdit({ rfq, onBack, onUpdate }: RFQEditProps) {
  // Basic Information
  const [title, setTitle] = useState(rfq.title)
  const [description, setDescription] = useState(rfq.description)
  const [quantity, setQuantity] = useState(rfq.quantity)
  const [status, setStatus] = useState(rfq.status)

  // Services and Specifications
  const [selectedServices, setSelectedServices] = useState<string[]>(rfq.services.map((s) => s.id))
  const [selectedSpecifications, setSelectedSpecifications] = useState<string[]>(
    rfq.rfqSpecifications.map((spec) => spec.specification.id),
  )

  // Component state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Data from APIs
  const [services, setServices] = useState<Service[]>([])
  const [specifications, setSpecifications] = useState<Specification[]>([])

  // Loading states
  const [isLoadingOptions, setIsLoadingOptions] = useState(true)

  // Load all options when component mounts
  useEffect(() => {
    loadAllOptions()
  }, [])

  const loadAllOptions = async () => {
    setIsLoadingOptions(true)

    try {
      const [servicesData, specificationsData] = await Promise.allSettled([fetchServices(), fetchSpecifications()])

      // Handle services
      if (servicesData.status === "fulfilled") {
        setServices(servicesData.value)
      }

      // Handle specifications
      if (specificationsData.status === "fulfilled") {
        setSpecifications(specificationsData.value)
      }
    } catch (err) {
      console.error("Error loading options:", err)
    } finally {
      setIsLoadingOptions(false)
    }
  }

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  const handleSpecificationToggle = (specificationId: string) => {
    setSelectedSpecifications((prev) =>
      prev.includes(specificationId) ? prev.filter((id) => id !== specificationId) : [...prev, specificationId],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    try {
      const updateData: UpdateRFQDto = {
        title,
        description,
        quantity,
        status,
        serviceIds: selectedServices,
        specificationIds: selectedSpecifications,
      }

      await updateRFQ(rfq.id, updateData)
      setSuccess(true)

      // Notify parent component that update was successful
      onUpdate()

      // Redirect back to details after a short delay
      setTimeout(() => {
        onBack()
      }, 1500)
    } catch (err) {
      console.error("Error updating RFQ:", err)
      setError("Failed to update RFQ. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit RFQ</h1>
        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>RFQ Information</CardTitle>
            <CardDescription>Update the RFQ details below</CardDescription>
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
                <AlertDescription>RFQ updated successfully!</AlertDescription>
              </Alert>
            )}

            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div className="space-y-2">
                <Label htmlFor="rfqId">RFQ ID (Read-only)</Label>
                <Input id="rfqId" value={rfq.id} disabled className="bg-muted font-mono" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="RFQ title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g., 100"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the RFQ requirements"
                  required
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Created At (Read-only)</Label>
                  <Input value={new Date(rfq.createdAt).toLocaleString()} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Updated At (Read-only)</Label>
                  <Input value={new Date(rfq.updatedAt).toLocaleString()} disabled className="bg-muted" />
                </div>
              </div>
            </div>

            <Separator className="dark:bg-slate-700" />

            {/* Customer Information (Read-only) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Information (Read-only)</h3>
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <User className="mr-2 h-4 w-4" />
                    <span className="font-medium">{rfq.customer.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="mr-2 h-4 w-4" />
                    <span>{rfq.customer.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building className="mr-2 h-4 w-4" />
                    <span>{rfq.customer.industryType?.name || "Not specified"}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-mono">Customer ID: {rfq.customer.id}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="dark:bg-slate-700" />

            {/* Services Selection Section */}
            {!isLoadingOptions && services.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={`service-${service.id}`}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={`service-${service.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {service.name}
                        </label>
                        <p className="text-xs text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedServices.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Selected {selectedServices.length} service{selectedServices.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            )}

            {!isLoadingOptions && services.length > 0 && <Separator className="dark:bg-slate-700" />}

            {/* Specifications Selection Section */}
            {!isLoadingOptions && specifications.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto border rounded-lg p-4">
                  {specifications.map((specification) => (
                    <div key={specification.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={`spec-${specification.id}`}
                        checked={selectedSpecifications.includes(specification.id)}
                        onCheckedChange={() => handleSpecificationToggle(specification.id)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={`spec-${specification.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {specification.name}
                        </label>
                        <p className="text-xs text-muted-foreground">{specification.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedSpecifications.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Selected {selectedSpecifications.length} specification
                    {selectedSpecifications.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            )}
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
