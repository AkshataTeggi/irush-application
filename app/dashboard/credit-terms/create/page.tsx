"use client"

import { CreditTermCreateForm } from "@/components/credit-term/credit-term-create-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CreateCreditTermPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push("/dashboard/credit-terms")
  }

  const handleSuccess = () => {
    router.push("/dashboard/credit-terms")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Credit Term</h1>
          <p className="text-muted-foreground">Add a new payment term for customer transactions</p>
        </div>
      </div>

      <CreditTermCreateForm onSuccess={handleSuccess} onCancel={handleBack} />
    </div>
  )
}
