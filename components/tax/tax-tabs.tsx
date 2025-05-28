"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaxList } from "./tax-list"
import { TaxListMobile } from "./tax-list-mobile"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Tax } from "@/types/ṭax"

interface TaxTabsProps {
  taxes: Tax[]
  onRefresh: () => void
}

export function TaxTabs({ taxes, onRefresh }: TaxTabsProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <Tabs defaultValue="all">
      <TabsList className="w-full">
        <TabsTrigger value="all" className="flex-1">
          All Taxes
        </TabsTrigger>
        <TabsTrigger value="active" className="flex-1">
          Active
        </TabsTrigger>
        <TabsTrigger value="inactive" className="flex-1">
          Inactive
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        {isDesktop ? (
          <TaxList taxes={taxes} onRefresh={onRefresh} />
        ) : (
          <TaxListMobile taxes={taxes} onRefresh={onRefresh} />
        )}
      </TabsContent>
      <TabsContent value="active">
        {isDesktop ? (
          <TaxList taxes={taxes.filter((tax) => tax.isActive)} onRefresh={onRefresh} />
        ) : (
          <TaxListMobile taxes={taxes.filter((tax) => tax.isActive)} onRefresh={onRefresh} />
        )}
      </TabsContent>
      <TabsContent value="inactive">
        {isDesktop ? (
          <TaxList taxes={taxes.filter((tax) => !tax.isActive)} onRefresh={onRefresh} />
        ) : (
          <TaxListMobile taxes={taxes.filter((tax) => !tax.isActive)} onRefresh={onRefresh} />
        )}
      </TabsContent>
    </Tabs>
  )
}
