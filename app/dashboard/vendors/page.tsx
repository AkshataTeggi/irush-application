"use client"

import { useState, useEffect } from "react"
import { VendorHeader } from "@/components/vendor/vendor-header"
import { VendorList } from "@/components/vendor/vendor-list"
import { VendorListMobile } from "@/components/vendor/vendor-list-mobile"
import { VendorLoading } from "@/components/vendor/vendor-loading"
import { VendorError } from "@/components/vendor/vendor-error"
import { fetchVendors } from "@/lib/vendor"
import type { Vendor } from "@/types/vendor"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const loadVendors = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchVendors()
      setVendors(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load vendors"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVendors()
  }, [])

  const handleVendorDeleted = () => {
    loadVendors()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <VendorHeader />
        <VendorLoading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <VendorHeader />
        <VendorError error={error} onRetry={loadVendors} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <VendorHeader />
      {isMobile ? (
        <VendorListMobile vendors={vendors} onVendorDeleted={handleVendorDeleted} />
      ) : (
        <VendorList vendors={vendors} onVendorDeleted={handleVendorDeleted} />
      )}
    </div>
  )
}
