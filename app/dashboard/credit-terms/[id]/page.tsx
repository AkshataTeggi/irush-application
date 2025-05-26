"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CreditTermDetail } from "@/components/credit-term/credit-term-detail"
import { CreditTermLoading } from "@/components/credit-term/credit-term-loading"
import { CreditTermError } from "@/components/credit-term/credit-term-error"
import { fetchCreditTermById } from "@/lib/credit-term"
import type { CreditTerm } from "@/types/credit-term"

interface CreditTermDetailPageProps {
  params: Promise<{ id: string }>
}

export default function CreditTermDetailPage({ params }: CreditTermDetailPageProps) {
  const router = useRouter()
  const [creditTerm, setCreditTerm] = useState<CreditTerm | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  const loadCreditTerm = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchCreditTermById(id)
      setCreditTerm(data)
    } catch (err) {
      console.error("Error loading credit term:", err)
      setError(err instanceof Error ? err.message : "Failed to load credit term")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (resolvedParams?.id) {
      loadCreditTerm(resolvedParams.id)
    }
  }, [resolvedParams])

  const handleBack = () => {
    router.push("/dashboard/credit-terms")
  }

  if (!resolvedParams) {
    return <CreditTermLoading />
  }

  if (isLoading) {
    return <CreditTermLoading />
  }

  if (error) {
    return <CreditTermError message={error} onRetry={() => loadCreditTerm(resolvedParams.id)} />
  }

  if (!creditTerm) {
    return <CreditTermError message="Credit term not found" />
  }

  return <CreditTermDetail creditTerm={creditTerm} onBack={handleBack} />
}
