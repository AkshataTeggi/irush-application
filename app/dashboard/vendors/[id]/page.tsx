"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { VendorLoading } from "@/components/vendor/vendor-loading"
import { VendorError } from "@/components/vendor/vendor-error"
import { fetchVendorById } from "@/lib/vendor"
import type { Vendor } from "@/types/vendor"
import { VendorDetail } from "@/components/vendor/vendor-details"

interface VendorDetailPageProps {
  params: Promise<{ id: string }>
}

export default function VendorDetailPage({ params }: VendorDetailPageProps) {
  const resolvedParams = use(params)
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadVendor() {
      try {
        const data = await fetchVendorById(resolvedParams.id)
        setVendor(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load vendor"))
      } finally {
        setLoading(false)
      }
    }

    loadVendor()
  }, [resolvedParams.id])

  const handleBack = () => {
    router.push("/dashboard/vendors")
  }

  if (loading) {
    return <VendorLoading />
  }

  if (error) {
    return <VendorError error={error} onRetry={() => window.location.reload()} />
  }

  if (!vendor) {
    return <VendorError error={new Error("Vendor not found")} />
  }

  return <VendorDetail vendor={vendor} onBack={handleBack} />
}
