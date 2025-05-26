"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { CustomerEdit } from "@/components/customer/customer-edit"
import { CustomerLoading } from "@/components/customer/customer-loading"
import { CustomerError } from "@/components/customer/customer-error"
import { fetchCustomerById } from "@/lib/customer"
import type { Customer } from "@/types/customer"

export default function CustomerEditPage() {
  const router = useRouter()
  const params = useParams()
  const customerId = params.id as string

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (customerId) {
      loadCustomer()
    }
  }, [customerId])

  const loadCustomer = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchCustomerById(customerId)
      setCustomer(data)
    } catch (err) {
      setError("Error loading customer. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/dashboard/customers")
  }

  const handleUpdate = () => {
    // Redirect to customers list page after successful update
    router.push("/dashboard/customers")
  }

  if (isLoading) {
    return <CustomerLoading />
  }

  if (error) {
    return <CustomerError error={error} />
  }

  if (!customer) {
    return <CustomerError error="Customer not found" />
  }

  return <CustomerEdit customer={customer} onBack={handleBack} onUpdate={handleUpdate} />
}
