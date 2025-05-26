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
import { AlertCircle, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import type { Customer, UpdateCustomerDto } from "@/types/customer"
import { updateCustomer } from "@/lib/customer"
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

interface CustomerEditProps {
  customer: Customer
  onBack: () => void
  onUpdate: () => void
}

export function CustomerEdit({ customer, onBack, onUpdate }: CustomerEditProps) {
  // Basic Information
  const [name, setName] = useState(customer.name)
  const [email, setEmail] = useState(customer.email)
  const [phone, setPhone] = useState(customer.phone)

  // Optional fields
  const [address, setAddress] = useState(customer.address || "")
  const [city, setCity] = useState(customer.city || "")
  const [state, setState] = useState(customer.state || "")
  const [zipCode, setZipCode] = useState(customer.zipCode || "")
  const [country, setCountry] = useState(customer.country || "")
  const [website, setWebsite] = useState(customer.website || "")
  const [industry, setIndustry] = useState(customer.industry || "")
  const [userId, setUserId] = useState(customer.userId || "")

  // Business fields
  const [creditTermId, setCreditTermId] = useState(customer.creditTermId)
  const [taxId, setTaxId] = useState(customer.taxId)
  const [industryId, setIndustryId] = useState(customer.industryId)
  const [salesmanId, setSalesmanId] = useState<string | null>(customer.salesmanId || null)

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
      } else {
        console.error("Failed to load industries:", industriesData.reason)
      }

      // Handle taxes
      if (taxesData.status === "fulfilled") {
        setTaxes(taxesData.value)
      } else {
        console.error("Failed to load taxes:", taxesData.reason)
      }

      // Handle credit terms
      if (creditTermsData.status === "fulfilled") {
        setCreditTerms(creditTermsData.value)
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

      const updateData: UpdateCustomerDto = {
        // Basic fields
        name,
        email,
        phone,
        creditTermId,
        taxId,
        industryId,

        // Optional fields - include even if empty to allow clearing
        address: address || undefined,
        city: city || undefined,
        state: state || undefined,
        zipCode: zipCode || undefined,
        country: country || undefined,
        website: website || undefined,
        industry: industry || undefined,
        userId: userId || undefined,

        // Only include salesmanId if it's not null
        ...(salesmanId && { salesmanId }),
      }

      console.log("Updating customer with data:", updateData)
      await updateCustomer(customer.id, updateData)
      setSuccess(true)

      // Notify parent component that update was successful
      onUpdate()

      // Redirect back to details after a short delay
      setTimeout(() => {
        onBack()
      }, 1500)
    } catch (err) {
      console.error("Error updating customer:", err)

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
        } else if (err.message.includes("Customer not found")) {
          setError("Customer not found. It may have been deleted.")
        } else {
          setError(err.message || "Failed to update customer. Please try again.")
        }
      } else {
        setError("Failed to update customer. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state while options are being fetched
  if (isLoadingOptions) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Edit Customer</h1>
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
        </div>
        <Card>
          <CardContent className="mt-5">
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading form options...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error if options failed to load
  if (optionsError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Edit Customer</h1>
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
        </div>
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Customer</h1>
        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Update the customer details below</CardDescription>
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
                <AlertDescription>Customer updated successfully!</AlertDescription>
              </Alert>
            )}

            {/* Customer ID (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer ID (Read-only)</Label>
              <Input id="customerId" value={customer.id} disabled className="bg-muted font-mono" />
            </div>

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
                      ⚠️ No active salesmen found. Customer will be updated without an assigned salesman.
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

            <Separator />

            {/* System Information (Read-only) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">System Information (Read-only)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Input value={customer.status} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Created At</Label>
                  <Input value={new Date(customer.createdAt).toLocaleString()} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Updated At</Label>
                  <Input value={new Date(customer.updatedAt).toLocaleString()} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Created By</Label>
                  <Input value={customer.createdBy || "System"} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Updated By</Label>
                  <Input value={customer.updatedBy || "—"} disabled className="bg-muted" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Current Relationship Information (Read-only) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Current Relationship Information (Read-only)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current Industry Type</Label>
                  <Input value={customer.industryType.name} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Current Salesman</Label>
                  <Input value={customer.salesman?.name || "Not assigned"} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Current Credit Term</Label>
                  <Input value={customer.creditTerm.name} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Current Tax</Label>
                  <Input value={customer.tax.name} disabled className="bg-muted" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || success || !creditTermId || !taxId || !industryId}>
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
