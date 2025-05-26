"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditTermList } from "./credit-term-list"
import { CreditTermListMobile } from "./credit-term-list-mobile"
import { useMediaQuery } from "@/hooks/use-media-query"

interface CreditTermTabsProps {
  creditTerms: any[]
  onRefresh: () => void
}

export function CreditTermTabs({ creditTerms, onRefresh }: CreditTermTabsProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (isMobile) {
    return <CreditTermListMobile creditTerms={creditTerms} onRefresh={onRefresh} />
  }

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList className="w-full">
        <TabsTrigger value="all" className="flex-1">
          All Terms
        </TabsTrigger>
        <TabsTrigger value="active" className="flex-1">
          Active
        </TabsTrigger>
        <TabsTrigger value="inactive" className="flex-1">
          Inactive
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <CreditTermList creditTerms={creditTerms} onRefresh={onRefresh} />
      </TabsContent>
      <TabsContent value="active">
        <CreditTermList creditTerms={creditTerms.filter((term) => term.isActive)} onRefresh={onRefresh} />
      </TabsContent>
      <TabsContent value="inactive">
        <CreditTermList creditTerms={creditTerms.filter((term) => !term.isActive)} onRefresh={onRefresh} />
      </TabsContent>
    </Tabs>
  )
}
