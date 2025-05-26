"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CreditTermEdit } from "@/components/credit-term/credit-term-edit"
import { CreditTermLoading } from "@/components/credit-term/credit-term-loading"
import { CreditTermError } from "@/components/credit-term/credit-term-error"
import { fetchCreditTermById } from "@/lib/credit-term"
import type { CreditTerm } from "@/types/credit-term"

interface CreditTermEditPageProps {
  params: Promise<{ id: string }>
}

export default function CreditTermEditPage({ params }: CreditTermEditPageProps) {
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
    router.push(`/dashboard/credit-terms/${resolvedParams?.id}`)
  }

  const handleUpdate = () => {
    if (resolvedParams?.id) {
      loadCreditTerm(resolvedParams.id)
    }
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

  return <CreditTermEdit creditTerm={creditTerm} onBack={handleBack} onUpdate={handleUpdate} />
}
