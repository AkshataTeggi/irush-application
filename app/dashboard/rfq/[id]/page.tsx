"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { RFQDetail } from "@/components/rfq/rfq-detail"
import { RFQLoading } from "@/components/rfq/rfq-loading"
import { RFQError } from "@/components/rfq/rfq-error"
import { fetchRFQById } from "@/lib/rfq"
import type { RFQ } from "@/types/rfq"

export default function RFQDetailPage() {
  const router = useRouter()
  const params = useParams()
  const rfqId = params.id as string

  const [rfq, setRFQ] = useState<RFQ | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (rfqId) {
      loadRFQ()
    }
  }, [rfqId])

  const loadRFQ = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchRFQById(rfqId)
      setRFQ(data)
    } catch (err) {
      setError("Error loading RFQ. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/dashboard/rfq")
  }

  const handleEdit = () => {
    router.push(`/dashboard/rfq/${rfqId}/edit`)
  }

  if (isLoading) {
    return <RFQLoading />
  }

  if (error) {
    return <RFQError error={error} />
  }

  if (!rfq) {
    return <RFQError error="RFQ not found" />
  }

  return <RFQDetail rfq={rfq} onBack={handleBack} onEdit={handleEdit} />
}
