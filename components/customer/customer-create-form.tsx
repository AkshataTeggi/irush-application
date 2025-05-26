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
import { AlertCircle, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import type { CreateCustomerDto } from "@/types/customer"
import { createCustomer } from "@/lib/customer"
import {
  fetchIndustries,
  fetchTaxes,
  fetchCreditTerms,
  fetchSalesmen,
  type Industry,
  type Tax,
  type CreditTerm,
  type Salesman,
} from "@/lib/customer-options"

interface CustomerCreateFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  showCard?: boolean
}

export function CustomerCreateForm({ onSuccess, onCancel, showCard = true }: CustomerCreateFormProps) {
  // Basic Information (Required fields)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  // Optional fields
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [country, setCountry] = useState("")
  const [website, setWebsite] = useState("")
  const [industry, setIndustry] = useState("")
  const [userId, setUserId] = useState("")

  // Required business fields
  const [creditTermId, setCreditTermId] = useState("")
  const [taxId, setTaxId] = useState("")
  const [industryId, setIndustryId] = useState("")

  // Optional business field - use null for no selection
  const [salesmanId, setSalesmanId] = useState<string | null>(null)

  // Component state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Data from APIs
  const [industries, setIndustries] = useState<Industry[]>([])
  const [taxes, setTaxes] = useState<Tax[]>([])
  const [creditTerms, setCreditTerms] = useState<CreditTerm[]>([])
  const [salesmen, setSalesmen] = useState<Salesman[]>([])

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
      const [industriesData, taxesData, creditTermsData, salesmenData] = await Promise.allSettled([
        fetchIndustries(),
        fetchTaxes(),
        fetchCreditTerms(),
        fetchSalesmen(),
      ])

      // Handle industries
      if (industriesData.status === "fulfilled") {
        setIndustries(industriesData.value)
        if (industriesData.value.length > 0) setIndustryId(industriesData.value[0].id)
      } else {
        console.error("Failed to load industries:", industriesData.reason)
      }

      // Handle taxes
      if (taxesData.status === "fulfilled") {
        setTaxes(taxesData.value)
        if (taxesData.value.length > 0) setTaxId(taxesData.value[0].id)
      } else {
        console.error("Failed to load taxes:", taxesData.reason)
      }

      // Handle credit terms
      if (creditTermsData.status === "fulfilled") {
        setCreditTerms(creditTermsData.value)
        if (creditTermsData.value.length > 0) setCreditTermId(creditTermsData.value[0].id)
      } else {
        console.error("Failed to load credit terms:", creditTermsData.reason)
      }

      // Handle salesmen (optional, so don't fail if this doesn't work)
      if (salesmenData.status === "fulfilled") {
        setSalesmen(salesmenData.value)
        console.log(`Loaded ${salesmenData.value.length} salesmen`)
      } else {
        console.error("Failed to load salesmen:", salesmenData.reason)
        setSalesmen([]) // Set empty array so form still works
      }

      // Check if any critical data failed to load
      const criticalDataMissing =
        industriesData.status === "rejected" || taxesData.status === "rejected" || creditTermsData.status === "rejected"

      if (criticalDataMissing) {
        setOptionsError("Failed to load some required form options. Please refresh the page and try again.")
      }
    } catch (err) {
      console.error("Error loading options:", err)
      setOptionsError("Failed to load form options. Please refresh the page.")
    } finally {
      setIsLoadingOptions(false)
    }
  }

  const resetForm = () => {
    // Basic Information
    setName("")
    setEmail("")
    setPhone("")

    // Optional fields
    setAddress("")
    setCity("")
    setState("")
    setZipCode("")
    setCountry("")
    setWebsite("")
    setIndustry("")
    setUserId("")

    // Business Information
    setSalesmanId(null) // Reset to null instead of empty string
    setCreditTermId(creditTerms.length > 0 ? creditTerms[0].id : "")
    setTaxId(taxes.length > 0 ? taxes[0].id : "")
    setIndustryId(industries.length > 0 ? industries[0].id : "")

    // Component state
    setError(null)
    setSuccess(false)
  }

  const handleSalesmanChange = (value: string) => {
    if (value === "none" || value === "") {
      setSalesmanId(null)
    } else {
      setSalesmanId(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    try {
      // Validate that required IDs exist
      if (!industryId || !taxId || !creditTermId) {
        throw new Error("Please select all required business information fields.")
      }

      // Validate salesmanId if provided - check if it exists in the salesmen list
      if (salesmanId && salesmen.length > 0 && !salesmen.find((s) => s.id === salesmanId)) {
        throw new Error("Selected salesman is not valid. Please choose a different salesman or leave unassigned.")
      }

      const customerData: CreateCustomerDto = {
        // Required fields
        name,
        email,
        phone,
        creditTermId,
        taxId,
        industryId,

        // Optional fields - only include if they have values
        ...(address && { address }),
        ...(city && { city }),
        ...(state && { state }),
        ...(zipCode && { zipCode }),
        ...(country && { country }),
        ...(website && { website }),
        ...(industry && { industry }),
        ...(userId && { userId }),

        // Only include salesmanId if it's not null
        ...(salesmanId && { salesmanId }),
      }

      console.log("Submitting customer data:", customerData)
      const createdCustomer = await createCustomer(customerData)
      console.log("Customer created successfully:", createdCustomer)
      setSuccess(true)
      resetForm()

      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 1500)
      }
    } catch (err) {
      console.error("Error creating customer:", err)

      // Handle specific error cases
      if (err instanceof Error) {
        if (err.message.includes("Foreign key constraint") && err.message.includes("salesmanId")) {
          setError(
            "The selected salesman is not valid or no longer exists. Please choose a different salesman or leave unassigned.",
          )
          // Reset salesmanId when this error occurs
          setSalesmanId(null)
        } else if (err.message.includes("Foreign key constraint") && err.message.includes("industryId")) {
          setError("The selected industry type is not valid. Please refresh the page and try again.")
        } else if (err.message.includes("Foreign key constraint") && err.message.includes("taxId")) {
          setError("The selected tax type is not valid. Please refresh the page and try again.")
        } else if (err.message.includes("Foreign key constraint") && err.message.includes("creditTermId")) {
          setError("The selected credit term is not valid. Please refresh the page and try again.")
        } else if (err.message.includes("email") && err.message.includes("already exists")) {
          setError("A customer with this email already exists. Please use a different email address.")
        } else if (err.message.includes("Unique constraint")) {
          setError("A customer with this information already exists. Please check the email address.")
        } else if (err.message.includes("Invalid customer data")) {
          setError("Please check all required fields and ensure the data is valid.")
        } else {
          setError(err.message || "Failed to create customer. Please try again.")
        }
      } else {
        setError("Failed to create customer. Please try again.")
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

  // Show error if options failed to load
  if (optionsError) {
    return (
      <Card>
        <CardContent className="mt-5">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{optionsError}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={loadAllOptions} variant="outline">
              <Loader2 className="mr-2 h-4 w-4" />
              Retry Loading
            </Button>
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
          <AlertDescription>Customer created successfully!</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Customer name"
                required
                disabled={isSubmitting || success}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                required
                disabled={isSubmitting || success}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91-9876543210"
                required
                disabled={isSubmitting || success}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://www.example.com"
                disabled={isSubmitting || success}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Industry description"
                disabled={isSubmitting || success}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Associated user ID"
                disabled={isSubmitting || success}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Address Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Address Information</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, building number, etc."
                disabled={isSubmitting || success}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  disabled={isSubmitting || success}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State/Province"
                  disabled={isSubmitting || success}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="ZIP/Postal Code"
                  disabled={isSubmitting || success}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                  disabled={isSubmitting || success}
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Business Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Business Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industryType">Industry Type *</Label>
              <Select value={industryId} onValueChange={setIndustryId} disabled={isSubmitting || success}>
                <SelectTrigger id="industryType">
                  <SelectValue placeholder="Select industry type" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industryItem) => (
                    <SelectItem key={industryItem.id} value={industryItem.id}>
                      {industryItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salesman">Assigned Salesman</Label>
              <Select
                value={salesmanId || "none"}
                onValueChange={handleSalesmanChange}
                disabled={isSubmitting || success}
              >
                <SelectTrigger id="salesman">
                  <SelectValue placeholder="Select salesman (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No salesman assigned</SelectItem>
                  {salesmen.length > 0 ? (
                    salesmen.map((salesman) => (
                      <SelectItem key={salesman.id} value={salesman.id}>
                        {salesman.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No salesmen available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {salesmen.length === 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  ⚠️ No active salesmen found. Customer will be created without an assigned salesman.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditTerm">Credit Terms *</Label>
              <Select value={creditTermId} onValueChange={setCreditTermId} disabled={isSubmitting || success}>
                <SelectTrigger id="creditTerm">
                  <SelectValue placeholder="Select credit terms" />
                </SelectTrigger>
                <SelectContent>
                  {creditTerms.map((term) => (
                    <SelectItem key={term.id} value={term.id}>
                      {term.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax">Tax *</Label>
              <Select value={taxId} onValueChange={setTaxId} disabled={isSubmitting || success}>
                <SelectTrigger id="tax">
                  <SelectValue placeholder="Select tax type" />
                </SelectTrigger>
                <SelectContent>
                  {taxes.map((tax) => (
                    <SelectItem key={tax.id} value={tax.id}>
                      {tax.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || success || !creditTermId || !taxId || !industryId}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Customer"
            )}
          </Button>
        </div>
      </form>
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
