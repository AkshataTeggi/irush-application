"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RFQCreateForm } from "@/components/rfq/rfq-create-form"

export default function CreateRFQPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/dashboard/rfq")
  }

  const handleCancel = () => {
    router.push("/dashboard/rfq")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create RFQ</h1>
        <Button variant="outline" onClick={handleCancel}>
          Back to RFQs
        </Button>
      </div>

      <RFQCreateForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  )
}
