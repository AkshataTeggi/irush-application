"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CustomerCreateForm } from "@/components/customer/customer-create-form"

export default function CreateCustomerPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/dashboard/customers")
  }

  const handleCancel = () => {
    router.push("/dashboard/customers")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create Customer</h1>
        <Button variant="outline" onClick={handleCancel}>
          Back to Customers
        </Button>
      </div>

      <CustomerCreateForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  )
}
