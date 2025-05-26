"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RFQList } from "@/components/rfq/rfq-list"
import { RfqListMobile } from "@/components/rfq/rfq-list-mobile"
import type { RFQ } from "@/types/rfq"

interface RFQTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
  rfqs: RFQ[]
  onView: (rfqId: string) => void
  onEdit: (rfqId: string) => void
  onDelete: (rfq: RFQ) => void
}

export function RFQTabs({ activeTab, onTabChange, rfqs, onView, onEdit, onDelete }: RFQTabsProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const filterRFQsByStatus = (status: string) => {
    if (status === "all") return rfqs
    return rfqs.filter((rfq) => rfq.status.toLowerCase() === status.toLowerCase())
  }

  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange}>
      <TabsList className="w-full grid grid-cols-5">
        <TabsTrigger value="all" className="w-full">
          All
        </TabsTrigger>
        <TabsTrigger value="draft" className="w-full">
          Draft
        </TabsTrigger>
        <TabsTrigger value="in_review" className="w-full">
          In Review
        </TabsTrigger>
        <TabsTrigger value="approved" className="w-full">
          Approved
        </TabsTrigger>
        <TabsTrigger value="completed" className="w-full">
          Completed
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-6">
        {isDesktop ? (
          <RFQList rfqs={filterRFQsByStatus("all")} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <RfqListMobile rfqs={filterRFQsByStatus("all")} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        )}
      </TabsContent>

      <TabsContent value="draft" className="mt-6">
        {isDesktop ? (
          <RFQList rfqs={filterRFQsByStatus("draft")} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <RfqListMobile rfqs={filterRFQsByStatus("draft")} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        )}
      </TabsContent>

      <TabsContent value="in_review" className="mt-6">
        {isDesktop ? (
          <RFQList rfqs={filterRFQsByStatus("in_review")} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <RfqListMobile rfqs={filterRFQsByStatus("in_review")} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        )}
      </TabsContent>

      <TabsContent value="approved" className="mt-6">
        {isDesktop ? (
          <RFQList rfqs={filterRFQsByStatus("approved")} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <RfqListMobile rfqs={filterRFQsByStatus("approved")} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        )}
      </TabsContent>

      <TabsContent value="completed" className="mt-6">
        {isDesktop ? (
          <RFQList rfqs={filterRFQsByStatus("completed")} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <RfqListMobile rfqs={filterRFQsByStatus("completed")} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        )}
      </TabsContent>
    </Tabs>
  )
}
