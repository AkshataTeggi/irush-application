"use client"

import { useState, useEffect } from "react"
import { TaxHeader } from "@/components/tax/tax-header"
import { TaxTabs } from "@/components/tax/tax-tabs"
import { TaxLoading } from "@/components/tax/tax-loading"
import { TaxError } from "@/components/tax/tax-error"
import { fetchTaxes } from "@/lib/tax"
import { Tax } from "@/types/ṭax"

export default function TaxPage() {
  const [taxes, setTaxes] = useState<Tax[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  async function loadTaxes() {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchTaxes()
      setTaxes(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load taxes"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTaxes()
  }, [])

  if (loading) {
    return <TaxLoading />
  }

  if (error) {
    return <TaxError error={error} onRetry={loadTaxes} />
  }

  return (
    <div className="space-y-6">
      <TaxHeader />
      <TaxTabs taxes={taxes} onRefresh={loadTaxes} />
    </div>
  )
}
