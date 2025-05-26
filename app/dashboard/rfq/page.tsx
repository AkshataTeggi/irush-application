"use client"

import { useState, useEffect } from "react"
import { RFQHeader } from "@/components/rfq/rfq-header"
import { RFQTabs } from "@/components/rfq/rfq-tabs"
import { DeleteConfirmDialog } from "@/components/department/delete-confirm-dialog"
import { RFQLoading } from "@/components/rfq/rfq-loading"
import { RFQError } from "@/components/rfq/rfq-error"
import { fetchRFQs, deleteRFQ } from "@/lib/rfq"
import type { RFQ } from "@/types/rfq"

export default function RFQPage() {
  const [rfqs, setRFQs] = useState<RFQ[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    loadRFQs()
  }, [])

  const loadRFQs = async (statusFilter?: string, customerFilter?: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchRFQs(statusFilter, customerFilter)
      setRFQs(data)
    } catch (err) {
      setError("Error loading RFQs. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRFQ = async () => {
    if (!selectedRFQ) return

    try {
      await deleteRFQ(selectedRFQ.id)
      await loadRFQs() // Refresh the list after deletion
      setIsDeleteDialogOpen(false)
    } catch (err) {
      console.error(err)
      setError("Failed to delete RFQ. Please try again.")
    }
  }

  const handleDeleteRFQClick = (rfq: RFQ) => {
    setSelectedRFQ(rfq)
    setIsDeleteDialogOpen(true)
  }

  const handleRefresh = () => {
    loadRFQs()
  }

  if (isLoading) {
    return <RFQLoading />
  }

  if (error) {
    return <RFQError error={error} />
  }

  return (
    <div className="space-y-6">
      <RFQHeader onRefresh={handleRefresh} />

      <RFQTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        rfqs={rfqs}
        onView={() => {}} // Now handled by router navigation
        onEdit={() => {}} // Now handled by router navigation
        onDelete={handleDeleteRFQClick}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteRFQ}
        title="Delete RFQ"
        description={`Are you sure you want to delete "${selectedRFQ?.title}"? This action cannot be undone.`}
      />
    </div>
  )
}
