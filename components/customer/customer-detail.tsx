"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Edit, ExternalLink } from "lucide-react"
import type { Customer } from "@/types/customer"

interface CustomerDetailProps {
  customer: Customer
  onBack: () => void
  onEdit: () => void
}

export function CustomerDetail({ customer, onBack, onEdit }: CustomerDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customer Details</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onBack}>
            Back to Customers
          </Button>
          <Button onClick={onEdit}>
            <Edit className="mr-1 h-4 w-4" /> Edit Customer
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="mt-5 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium">Customer ID</h4>
                <p className="text-sm text-muted-foreground font-mono break-all">{customer.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Name</h4>
                <p className="text-sm text-muted-foreground">{customer.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Email</h4>
                <p className="text-sm text-muted-foreground">{customer.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Phone</h4>
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Website</h4>
                {customer.website ? (
                  <a
                    href={customer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                  >
                    {customer.website}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium">Status</h4>
                <p
                  className={`text-sm ${customer.status === "active" ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
                >
                  {customer.status === "active" ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>

          <Separator className="dark:bg-slate-700" />

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium">Address</h4>
                <p className="text-sm text-muted-foreground">{customer.address}</p>
              </div>
              {customer.county && (
                <div>
                  <h4 className="text-sm font-medium">County</h4>
                  <p className="text-sm text-muted-foreground">{customer.county}</p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium">City</h4>
                <p className="text-sm text-muted-foreground">{customer.city}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">State</h4>
                <p className="text-sm text-muted-foreground">{customer.state}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">ZIP Code</h4>
                <p className="text-sm text-muted-foreground">{customer.zipCode}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Country</h4>
                <p className="text-sm text-muted-foreground">{customer.country}</p>
              </div>
            </div>
          </div>

          <Separator className="dark:bg-slate-700" />

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium">Industry Type</h4>
                <p className="text-sm text-muted-foreground">{customer.industryType.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Assigned Salesman</h4>
                <p className="text-sm text-muted-foreground">{customer.salesman?.name || "Not assigned"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Credit Terms</h4>
                <p className="text-sm text-muted-foreground">{customer.creditTerm.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Tax</h4>
                <p className="text-sm text-muted-foreground">
                  {customer.tax.name ? `${customer.tax.name} (${customer.tax.rate}%)` : `${customer.tax.rate}%`}
                </p>
              </div>
            </div>
          </div>

          {customer.customerAddress && customer.customerAddress.length > 0 && (
            <>
              <Separator className="dark:bg-slate-700" />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Customer Addresses</h3>
                <div className="space-y-4">
                  {customer.customerAddress.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">
                          {address.type} Address
                          {address.isPrimary && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-1 rounded">
                              Primary
                            </span>
                          )}
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="md:col-span-2">
                          <span className="font-medium">Address:</span> {address.address}
                        </div>
                        <div>
                          <span className="font-medium">City:</span> {address.city}
                        </div>
                        <div>
                          <span className="font-medium">State:</span> {address.state}
                        </div>
                        <div>
                          <span className="font-medium">ZIP:</span> {address.zipCode}
                        </div>
                        <div>
                          <span className="font-medium">Country:</span> {address.country}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {customer.contacts && customer.contacts.length > 0 && (
            <>
              <Separator className="dark:bg-slate-700" />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Customer Contacts</h3>
                <div className="space-y-4">
                  {customer.contacts.map((contact) => (
                    <div key={contact.id} className="border rounded-lg p-4 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">
                          {contact.name}
                          {contact.isPrimary && (
                            <span className="ml-2 text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded">
                              Primary Contact
                            </span>
                          )}
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Position:</span> {contact.position}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {contact.phone}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator className="dark:bg-slate-700" />

          {/* System Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium">Created At</h4>
                <p className="text-sm text-muted-foreground">{new Date(customer.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Updated At</h4>
                <p className="text-sm text-muted-foreground">{new Date(customer.updatedAt).toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Created By</h4>
                <p className="text-sm text-muted-foreground">{customer.createdBy || "System"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Updated By</h4>
                <p className="text-sm text-muted-foreground">{customer.updatedBy || "—"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
