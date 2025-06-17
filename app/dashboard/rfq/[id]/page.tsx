// "use client"

// import { useState, useEffect } from "react"
// import { useRouter, useParams } from "next/navigation"
// import { RFQDetail } from "@/components/rfq/rfq-detail"
// import { RFQLoading } from "@/components/rfq/rfq-loading"
// import { RFQError } from "@/components/rfq/rfq-error"
// import { fetchRFQById } from "@/lib/rfq"
// import type { RFQ } from "@/types/rfq"

// export default function RFQDetailPage() {
//   const router = useRouter()
//   const params = useParams()
//   const rfqId = params.id as string

//   const [rfq, setRFQ] = useState<RFQ | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     if (rfqId) {
//       loadRFQ()
//     }
//   }, [rfqId])

//   const loadRFQ = async () => {
//     setIsLoading(true)
//     setError(null)
//     try {
//       const data = await fetchRFQById(rfqId)
//       setRFQ(data)
//     } catch (err) {
//       setError("Error loading RFQ. Please try again.")
//       console.error(err)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleBack = () => {
//     router.push("/dashboard/rfq")
//   }

//   const handleEdit = () => {
//     router.push(`/dashboard/rfq/${rfqId}/edit`)
//   }

//   if (isLoading) {
//     return <RFQLoading />
//   }

//   if (error) {
//     return <RFQError error={error} />
//   }

//   if (!rfq) {
//     return <RFQError error="RFQ not found" />
//   }

//   return <RFQDetail rfq={rfq} onBack={handleBack} onEdit={handleEdit} />
// }
















"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import type { RFQ } from "@/types/rfq"
import { RFQDetailWithImport } from "@/components/rfq/rfq-detail"
import { API_BASE_URL } from "@/lib/constants"

// Base URL for API calls

export default function RFQDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [rfq, setRfq] = useState<RFQ | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Properly unwrap params using React.use()
  const { id: rfqId } = use(params)

  useEffect(() => {
    async function fetchRFQData() {
      if (!rfqId) return

      try {
        setIsLoading(true)
        console.log(`Fetching RFQ data from: ${API_BASE_URL}/rfqs/${rfqId}`)

        const response = await fetch(`${API_BASE_URL}/rfqs/${rfqId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch RFQ: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        setRfq(data)
      } catch (err) {
        console.error("Error fetching RFQ:", err)
        setError(err instanceof Error ? err.message : "Failed to load RFQ details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRFQData()
  }, [rfqId])

  const handleBack = () => {
    router.push("/dashboard/rfqs")
  }

  const handleEdit = () => {
    router.push(`/dashboard/rfq/${rfqId}/edit`)
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <div className="mt-2 text-sm">
              <p>Please check that:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>The server is running at {API_BASE_URL}</li>
                <li>The RFQ ID "{rfqId}" is valid</li>
                <li>You have permission to access this RFQ</li>
                <li>CORS is properly configured on the server</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!rfq) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Loading RFQ data...</p>
        </div>
      </div>
    )
  }

  return <RFQDetailWithImport rfq={rfq} onBack={handleBack} onEdit={handleEdit} />
}
