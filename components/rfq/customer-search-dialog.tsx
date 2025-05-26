"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Search, Loader2, Mail, Phone, MapPin, Building } from "lucide-react"
import { fetchCustomers } from "@/lib/customer"
import type { Customer } from "@/types/customer"

interface CustomerSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectCustomer: (customer: Customer) => void
}

export function CustomerSearchDialog({ open, onOpenChange, onSelectCustomer }: CustomerSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      loadCustomers()
    }
  }, [open])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCustomers(customers)
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredCustomers(filtered)
    }
  }, [searchTerm, customers])

  const loadCustomers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchCustomers()
      // Filter only active customers
      const activeCustomers = data.filter((customer) => customer.status === "active")
      setCustomers(activeCustomers)
      setFilteredCustomers(activeCustomers)
    } catch (err) {
      setError("Failed to load customers. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectCustomer = (customer: Customer) => {
    onSelectCustomer(customer)
    onOpenChange(false)
    setSearchTerm("")
  }

  const handleClose = () => {
    onOpenChange(false)
    setSearchTerm("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Search Customers</DialogTitle>
          <DialogDescription>Search and select a customer for this RFQ.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search by name, email, or ID</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Type to search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="border rounded-md max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading customers...</span>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                {searchTerm ? "No customers found matching your search." : "No active customers available."}
              </div>
            ) : (
              <div className="divide-y">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="p-4 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1 flex-1">
                          <h4 className="font-medium text-lg">{customer.name}</h4>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Mail className="mr-2 h-4 w-4" />
                              <span>{customer.email}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Phone className="mr-2 h-4 w-4" />
                              <span>{customer.phone}</span>
                            </div>
                            {customer.address && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="mr-2 h-4 w-4" />
                                <span className="truncate">
                                  {customer.address}, {customer.city}, {customer.state}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Building className="mr-2 h-4 w-4" />
                              <span>{customer.industryType.name}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                          Active
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-mono">ID: {customer.id}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
