"use client"

import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Calendar, ExternalLink, Building, User, CreditCard, Receipt } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Customer } from "@/types/customer"

interface CustomerListMobileProps {
  customers: Customer[]
  onView: (customerId: string) => void
  onEdit: (customerId: string) => void
  onDelete: (customer: Customer) => void
}

export function CustomerListMobile({ customers, onView, onEdit, onDelete }: CustomerListMobileProps) {
  const router = useRouter()

  if (customers.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-muted rounded-lg dark:bg-slate-800">
        <p className="text-muted-foreground">No customers found</p>
      </div>
    )
  }

  const handleViewClick = (customerId: string) => {
    router.push(`/dashboard/customers/${customerId}`)
  }

  const handleEditClick = (customerId: string) => {
    router.push(`/dashboard/customers/${customerId}/edit`)
  }

  return (
    <div className="space-y-4">
      {customers.map((customer) => (
        <div key={customer.id} className="rounded-lg border p-4 dark:border-slate-700 bg-card">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium text-lg">{customer.name}</h3>
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            </div>
            <span
              className={`text-sm px-2 py-1 rounded ${
                customer.status === "active"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : customer.status === "prospect"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
              }`}
            >
              {customer.status === "active" ? "Active" : customer.status === "prospect" ? "Prospect" : "Inactive"}
            </span>
          </div>

          {/* Contact Information */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="mr-2 h-4 w-4" />
              <span className="truncate">{customer.email}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="mr-2 h-4 w-4" />
              <span>{customer.phone}</span>
            </div>
            {customer.website && (
              <div className="flex items-center text-sm text-muted-foreground">
                <ExternalLink className="mr-2 h-4 w-4" />
                <a
                  href={customer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate"
                >
                  {customer.website}
                </a>
              </div>
            )}
          </div>

          {/* Address Information */}
          <div className="space-y-2 mb-4">
            <div className="flex items-start text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <div>{customer.address}</div>
                <div>
                  {customer.city}, {customer.state} {customer.zipCode}
                </div>
                {customer.county && <div>{customer.county}</div>}
                <div>{customer.country}</div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Building className="mr-2 h-4 w-4" />
              <span>
                <span className="font-medium">Industry:</span> {customer.industryType.name}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="mr-2 h-4 w-4" />
              <span>
                <span className="font-medium">Salesman:</span> {customer.salesman?.name || "Not assigned"}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>
                <span className="font-medium">Credit Term:</span> {customer.creditTerm.name}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Receipt className="mr-2 h-4 w-4" />
              <span>
                <span className="font-medium">Tax:</span> {customer.tax.rate}%
              </span>
            </div>
          </div>

          {/* System Information */}
          <div className="space-y-1 mb-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              <span>Created: {new Date(customer.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              <span>Updated: {new Date(customer.updatedAt).toLocaleString()}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              <span className="font-mono">ID: {customer.id}</span>
            </div>
          </div>

          {/* Customer Addresses */}
          {customer.customerAddress && customer.customerAddress.length > 0 && (
            <div className="space-y-2 mb-4">
              <h4 className="text-sm font-semibold">Additional Addresses</h4>
              {customer.customerAddress.map((address) => (
                <div
                  key={address.id}
                  className="text-xs text-muted-foreground border-l-2 border-gray-200 dark:border-gray-700 pl-2"
                >
                  <div className="font-medium">
                    {address.type} {address.isPrimary && "(Primary)"}
                  </div>
                  <div>{address.address}</div>
                  <div>
                    {address.city}, {address.state} {address.zipCode}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Customer Contacts */}
          {customer.contacts && customer.contacts.length > 0 && (
            <div className="space-y-2 mb-4">
              <h4 className="text-sm font-semibold">Contacts</h4>
              {customer.contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="text-xs text-muted-foreground border-l-2 border-blue-200 dark:border-blue-700 pl-2"
                >
                  <div className="font-medium">
                    {contact.name} {contact.isPrimary && "(Primary)"}
                  </div>
                  <div>{contact.position}</div>
                  <div>{contact.phone}</div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleViewClick(customer.id)}>
              View
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleEditClick(customer.id)}>
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              onClick={() => onDelete(customer)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
