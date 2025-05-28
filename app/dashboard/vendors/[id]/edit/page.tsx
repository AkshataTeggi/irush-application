"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { VendorEdit } from "@/components/vendor/vendor-edit"
import { VendorLoading } from "@/components/vendor/vendor-loading"
import { VendorError } from "@/components/vendor/vendor-error"
import { fetchVendorById } from "@/lib/vendor"
import type { Vendor } from "@/types/vendor"

interface VendorEditPageProps {
  params: Promise<{ id: string }>
}

export default function VendorEditPage({ params }: VendorEditPageProps) {
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

  const handleUpdate = (updatedVendor: Vendor) => {
    setVendor(updatedVendor)
    router.push(`/dashboard/vendors/${updatedVendor.id}`)
  }

  const handleBack = () => {
    router.push(`/dashboard/vendors/${resolvedParams.id}`)
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

  return <VendorEdit vendor={vendor} onUpdate={handleUpdate} onBack={handleBack} />
}
