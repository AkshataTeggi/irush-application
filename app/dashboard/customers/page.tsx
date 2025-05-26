"use client"

import { useState, useEffect } from "react"
import { CustomerHeader } from "@/components/customer/customer-header"
import { CustomerTabs } from "@/components/customer/customer-tabs"
import { DeleteConfirmDialog } from "@/components/department/delete-confirm-dialog"
import { CustomerLoading } from "@/components/customer/customer-loading"
import { CustomerError } from "@/components/customer/customer-error"
import { fetchCustomers, deleteCustomer } from "@/lib/customer"
import type { Customer } from "@/types/customer"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchCustomers()
      setCustomers(data)
    } catch (err) {
      setError("Error loading customers. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return

    try {
      await deleteCustomer(selectedCustomer.id)
      await loadCustomers() // Refresh the list after deletion
      setIsDeleteDialogOpen(false)
    } catch (err) {
      console.error(err)
      setError("Failed to delete customer. Please try again.")
    }
  }

  const handleDeleteCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDeleteDialogOpen(true)
  }

  const handleRefresh = () => {
    loadCustomers()
  }

  const filteredCustomers = customers.filter((customer) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return customer.status === "active"
    if (activeTab === "inactive") return customer.status !== "active"
    return true
  })

  if (isLoading) {
    return <CustomerLoading />
  }

  if (error) {
    return <CustomerError error={error} />
  }

  return (
    <div className="space-y-6">
      <CustomerHeader onRefresh={handleRefresh} />

      <CustomerTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        customers={filteredCustomers}
        onView={() => {}} // Now handled by router navigation
        onEdit={() => {}} // Now handled by router navigation
        onDelete={handleDeleteCustomerClick}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteCustomer}
        title="Delete Customer"
        description={`Are you sure you want to delete ${selectedCustomer?.name}? This action cannot be undone.`}
      />
    </div>
  )
}
