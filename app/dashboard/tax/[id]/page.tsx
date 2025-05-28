"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TaxDetail } from "@/components/tax/tax-detail"
import { TaxLoading } from "@/components/tax/tax-loading"
import { TaxError } from "@/components/tax/tax-error"
import { fetchTaxById } from "@/lib/tax"
import { Tax } from "@/types/ṭax"

export default function TaxDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [tax, setTax] = useState<Tax | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()

  async function loadTax() {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchTaxById(resolvedParams.id)
      setTax(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load tax"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTax()
  }, [resolvedParams.id])

  function handleBack() {
    router.push("/dashboard/tax")
  }

  if (loading) {
    return <TaxLoading />
  }

  if (error) {
    return <TaxError error={error} onRetry={loadTax} />
  }

  if (!tax) {
    return <TaxError error={new Error("Tax not found")} onRetry={loadTax} />
  }

  return <TaxDetail tax={tax} onBack={handleBack} />
}
