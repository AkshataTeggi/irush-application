"use client"

import { useState, useEffect } from "react"
import { CreditTermHeader } from "@/components/credit-term/credit-term-header"
import { CreditTermTabs } from "@/components/credit-term/credit-term-tabs"
import { CreditTermLoading } from "@/components/credit-term/credit-term-loading"
import { CreditTermError } from "@/components/credit-term/credit-term-error"
import { fetchCreditTerms } from "@/lib/credit-term"
import type { CreditTerm } from "@/types/credit-term"

export default function CreditTermsPage() {
  const [creditTerms, setCreditTerms] = useState<CreditTerm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCreditTerms = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchCreditTerms()
      setCreditTerms(data)
    } catch (err) {
      console.error("Error loading credit terms:", err)
      setError(err instanceof Error ? err.message : "Failed to load credit terms")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCreditTerms()
  }, [])

  if (isLoading) {
    return <CreditTermLoading />
  }

  if (error) {
    return <CreditTermError message={error} onRetry={loadCreditTerms} />
  }

  return (
    <div className="space-y-6">
      <CreditTermHeader />
      <CreditTermTabs creditTerms={creditTerms} onRefresh={loadCreditTerms} />
    </div>
  )
}
