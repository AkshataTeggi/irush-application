"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Search, CheckCircle, User, Mail, Building } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import type { CreateRFQDto } from "@/types/rfq"
import { createRFQ } from "@/lib/rfq"
import { RFQ_STATUSES } from "@/types/rfq"
import type { Customer } from "@/types/customer"
import { CustomerSearchDialog } from "@/components/rfq/customer-search-dialog"
import { Service, Specification, fetchServices, fetchSpecifications } from "@/lib/rfq-option"

interface RFQCreateFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  showCard?: boolean
}

export function RFQCreateForm({ onSuccess, onCancel, showCard = true }: RFQCreateFormProps) {
  // Basic Information
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [quantity, setQuantity] = useState("")
  const [status, setStatus] = useState("draft")

  // Customer Information
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState(false)

  // Services and Specifications
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedSpecifications, setSelectedSpecifications] = useState<string[]>([])

  // Component state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Data from APIs
  const [services, setServices] = useState<Service[]>([])
  const [specifications, setSpecifications] = useState<Specification[]>([])

  // Loading states
  const [isLoadingOptions, setIsLoadingOptions] = useState(true)
  const [optionsError, setOptionsError] = useState<string | null>(null)

  // Load all options when component mounts
  useEffect(() => {
    loadAllOptions()
  }, [])

  const loadAllOptions = async () => {
    setIsLoadingOptions(true)
    setOptionsError(null)

    try {
      const [servicesData, specificationsData] = await Promise.allSettled([fetchServices(), fetchSpecifications()])

      // Handle services
      if (servicesData.status === "fulfilled") {
        setServices(servicesData.value)
        console.log(`Loaded ${servicesData.value.length} services`)
      } else {
        console.error("Failed to load services:", servicesData.reason)
      }

      // Handle specifications
      if (specificationsData.status === "fulfilled") {
        setSpecifications(specificationsData.value)
        console.log(`Loaded ${specificationsData.value.length} specifications`)
      } else {
        console.error("Failed to load specifications:", specificationsData.reason)
      }
    } catch (err) {
      console.error("Error loading options:", err)
      setOptionsError("Failed to load form options. Some features may not be available.")
    } finally {
      setIsLoadingOptions(false)
    }
  }

  const resetForm = () => {
    // Basic Information
    setTitle("")
    setDescription("")
    setQuantity("")
    setStatus("draft")

    // Customer Information
    setSelectedCustomer(null)

    // Services and Specifications
    setSelectedServices([])
    setSelectedSpecifications([])

    // Component state
    setError(null)
    setSuccess(false)
  }

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer)
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
      // Validate required fields
      if (!selectedCustomer) {
        throw new Error("Please select a customer for this RFQ.")
      }

      const rfqData: CreateRFQDto = {
        title,
        description,
        quantity,
        status,
        customerId: selectedCustomer.id,
        ...(selectedServices.length > 0 && { serviceIds: selectedServices }),
        ...(selectedSpecifications.length > 0 && { specificationIds: selectedSpecifications }),
      }

      console.log("Submitting RFQ data:", rfqData)
      const createdRFQ = await createRFQ(rfqData)
      console.log("RFQ created successfully:", createdRFQ)
      setSuccess(true)
      resetForm()

      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 1500)
      }
    } catch (err) {
      console.error("Error creating RFQ:", err)

      if (err instanceof Error) {
        if (err.message.includes("Customer not found")) {
          setError("The selected customer is no longer available. Please select a different customer.")
          setSelectedCustomer(null)
        } else if (err.message.includes("Validation failed")) {
          setError(err.message)
        } else {
          setError(err.message || "Failed to create RFQ. Please try again.")
        }
      } else {
        setError("Failed to create RFQ. Please try again.")
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

  // Show loading state while options are being fetched
  if (isLoadingOptions) {
    return (
      <Card>
        <CardContent className="mt-5">
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading form options...</span>
          </div>
        </CardContent>
      </Card>
    )
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
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>RFQ created successfully!</AlertDescription>
        </Alert>
      )}
      {optionsError && (
        <Alert className="mb-4 bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{optionsError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="RFQ title"
                required
                disabled={isSubmitting || success}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., 100"
                required
                disabled={isSubmitting || success}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description of the RFQ requirements"
                required
                disabled={isSubmitting || success}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus} disabled={isSubmitting || success}>
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
          </div>
        </div>

        <Separator />

        {/* Customer Selection Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Customer Selection</h3>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCustomerSearchOpen(true)}
              disabled={isSubmitting || success}
              className="flex-1"
            >
              <Search className="mr-2 h-4 w-4" />
              {selectedCustomer ? "Change Customer" : "Search Customer"}
            </Button>
          </div>

          {/* Selected Customer Information */}
          {selectedCustomer && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-medium mb-2">Selected Customer</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <User className="mr-2 h-4 w-4" />
                  <span className="font-medium">{selectedCustomer.name}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Building className="mr-2 h-4 w-4" />
                  <span>{selectedCustomer.industryType.name}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-mono">ID: {selectedCustomer.id}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Services Selection Section */}
        {services.length > 0 && (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Services (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div key={service.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`service-${service.id}`}
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={() => handleServiceToggle(service.id)}
                      disabled={isSubmitting || success}
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
            <Separator />
          </>
        )}

        {/* Specifications Selection Section */}
        {specifications.length > 0 && (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Specifications (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto border rounded-lg p-4">
                {specifications.map((specification) => (
                  <div key={specification.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`spec-${specification.id}`}
                      checked={selectedSpecifications.includes(specification.id)}
                      onCheckedChange={() => handleSpecificationToggle(specification.id)}
                      disabled={isSubmitting || success}
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
                  Selected {selectedSpecifications.length} specification{selectedSpecifications.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            <Separator />
          </>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || success || !selectedCustomer}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create RFQ"
            )}
          </Button>
        </div>
      </form>

      <CustomerSearchDialog
        open={isCustomerSearchOpen}
        onOpenChange={setIsCustomerSearchOpen}
        onSelectCustomer={handleCustomerSelect}
      />
    </>
  )

  if (showCard) {
    return (
      <Card>
        <CardContent className="mt-5">{formContent}</CardContent>
      </Card>
    )
  }

  return <div className="space-y-4">{formContent}</div>
}
