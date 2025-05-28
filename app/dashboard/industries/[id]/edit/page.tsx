"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchIndustryById } from "@/lib/industry"
import { IndustryEdit } from "@/components/industry/industry-edit"
import { IndustryLoading } from "@/components/industry/industry-loading"
import { IndustryError } from "@/components/industry/industry-error"
import type { Industry } from "@/types/industry"

interface IndustryEditPageProps {
  params: Promise<{
    id: string
  }>
}

export default function IndustryEditPage({ params }: IndustryEditPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [industry, setIndustry] = useState<Industry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadIndustry() {
      try {
        const data = await fetchIndustryById(resolvedParams.id)
        setIndustry(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load industry"))
      } finally {
        setIsLoading(false)
      }
    }

    loadIndustry()
  }, [resolvedParams.id])

  const handleBack = () => {
    router.push(`/dashboard/industries/${resolvedParams.id}`)
  }

  if (isLoading) {
    return <IndustryLoading />
  }

  if (error) {
    return <IndustryError error={error} reset={() => window.location.reload()} />
  }

  if (!industry) {
    return <IndustryError error={new Error("Industry not found")} reset={() => window.location.reload()} />
  }

  return <IndustryEdit industry={industry} onBack={handleBack} />
}
