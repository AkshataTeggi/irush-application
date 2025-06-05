"use client"

import { useState, useEffect } from "react"
import { CreditTermHeader } from "@/components/credit-term/credit-term-header"
import { CreditTermLoading } from "@/components/credit-term/credit-term-loading"
import { CreditTermError } from "@/components/credit-term/credit-term-error"
import { fetchCreditTerms } from "@/lib/credit-term"
import type { CreditTerm } from "@/types/credit-term"
import { CreditTermList } from "@/components/credit-term/credit-term-list"

export default function CreditTermsPage(onRefresh: () => void) {
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

  if(!creditTerms||creditTerms.length===0){
    return(
      <p>
        No credit Terms found
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <CreditTermHeader />
       <CreditTermList creditTerms={creditTerms} onRefresh={onRefresh} />
    </div>
  )
}
