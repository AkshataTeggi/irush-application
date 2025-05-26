"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ExternalLink } from "lucide-react"
import type { Customer } from "@/types/customer"

interface CustomerListProps {
  customers: Customer[]
  onView: (customerId: string) => void
  onEdit: (customerId: string) => void
  onDelete: (customer: Customer) => void
}

export function CustomerList({ customers, onView, onEdit, onDelete }: CustomerListProps) {
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
    <div className="rounded-md border dark:border-slate-700">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b dark:[&_tr]:border-slate-700">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:border-slate-700">
              <th className="h-12 px-3  align-middle font-medium text-muted-foreground whitespace-nowrap">
                Name
              </th>
              <th className="h-12 px-3 align-middle font-medium text-muted-foreground whitespace-nowrap">
                Email
              </th>
              <th className="h-12 px-3  align-middle font-medium text-muted-foreground whitespace-nowrap">
                Phone
              </th>
              <th className="h-12 px-3  align-middle font-medium text-muted-foreground whitespace-nowrap">
                Address
              </th>
              <th className="h-12 px-3  align-middle font-medium text-muted-foreground whitespace-nowrap">
                City
              </th>
              <th className="h-12 px-3  align-middle font-medium text-muted-foreground whitespace-nowrap">
                State
              </th>
              <th className="h-12 px-3  align-middle font-medium text-muted-foreground whitespace-nowrap">
                ZIP
              </th>
              <th className="h-12 px-3  align-middle font-medium text-muted-foreground whitespace-nowrap">
                Country
              </th>
              <th className="h-12 px-3  align-middle font-medium text-muted-foreground whitespace-nowrap">
                Website
              </th>
              <th className="h-12 px-3  align-middle font-medium text-muted-foreground whitespace-nowrap">
                Industry
              </th>
              <th className="h-12 px-3  align-middle font-medium text-muted-foreground whitespace-nowrap">
                Salesman
              </th>
              <th className="h-12 px-3  align-middle font-medium text-muted-foreground whitespace-nowrap">
                Credit Term
              </th>
              <th className="h-12 px-3  align-middle font-medium text-muted-foreground whitespace-nowrap">
                Tax
              </th>
              <th className="h-12 px-3  align-middle font-medium text-muted-foreground whitespace-nowrap">
                Status
              </th>
              <th className="h-12 px-3  align-middle font-medium text-muted-foreground whitespace-nowrap">
                Created
              </th>
              <th className="h-12 px-3  align-middle font-medium text-muted-foreground whitespace-nowrap">
                Updated
              </th>
              <th className="h-12 px-3  align-middle font-medium text-muted-foreground whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:border-slate-700"
              >
                <td className="p-3 align-middle font-medium whitespace-nowrap max-w-[150px]">
                  <div className="truncate" title={customer.name}>
                    {customer.name}
                  </div>
                </td>
                <td className="p-3 align-middle whitespace-nowrap max-w-[180px]">
                  <div className="truncate" title={customer.email}>
                    {customer.email}
                  </div>
                </td>
                <td className="p-3 align-middle whitespace-nowrap">{customer.phone}</td>
                <td className="p-3 align-middle whitespace-nowrap max-w-[200px]">
                  <div className="truncate" title={customer.address}>
                    {customer.address}
                  </div>
                </td>
                <td className="p-3 align-middle whitespace-nowrap">{customer.city}</td>
                <td className="p-3 align-middle whitespace-nowrap">{customer.state}</td>
                <td className="p-3 align-middle whitespace-nowrap">{customer.zipCode}</td>
                <td className="p-3 align-middle whitespace-nowrap">{customer.country}</td>
                <td className="p-3 align-middle whitespace-nowrap max-w-[150px]">
                  {customer.website ? (
                    <a
                      href={customer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                      title={customer.website}
                    >
                      <span className="truncate max-w-[120px]">{customer.website}</span>
                      <ExternalLink className="ml-1 h-3 w-3 flex-shrink-0" />
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-3 align-middle whitespace-nowrap max-w-[120px]">
                  <div className="truncate" title={customer.industryType.name}>
                    {customer.industryType.name}
                  </div>
                </td>
                <td className="p-3 align-middle whitespace-nowrap max-w-[120px]">
                  <div className="truncate" title={customer.salesman?.name || "Not assigned"}>
                    {customer.salesman?.name || "—"}
                  </div>
                </td>
                <td className="p-3 align-middle whitespace-nowrap max-w-[120px]">
                  <div className="truncate" title={customer.creditTerm.name}>
                    {customer.creditTerm.name}
                  </div>
                </td>
                <td className="p-3 align-middle whitespace-nowrap max-w-[100px]">
                  <div className="truncate" title={customer.tax.name}>
                    {customer.tax.name}
                  </div>
                </td>
                <td className="p-3 align-middle whitespace-nowrap">
                  <span
                    className={
                      customer.status === "active"
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  >
                    {customer.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3 align-middle text-xs whitespace-nowrap">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 align-middle text-xs whitespace-nowrap">
                  {new Date(customer.updatedAt).toLocaleDateString()}
                </td>
                <td className="p-3 align-middle whitespace-nowrap">
                  <div className="flex space-x-1">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
