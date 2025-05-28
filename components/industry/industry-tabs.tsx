"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IndustryList } from "@/components/industry/industry-list"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { Industry } from "@/types/industry"
import IndustryListMobile from "./industry-list-mobile"

interface IndustryTabsProps {
  industries: Industry[]
}

export function IndustryTabs({ industries }: IndustryTabsProps) {
  const [activeTab, setActiveTab] = useState("all")
  const isMobile = useMediaQuery("(max-width: 768px)")

  const filteredIndustries = {
    all: industries,
    active: industries.filter((industry) => industry.status === "active"),
    inactive: industries.filter((industry) => industry.status === "inactive"),
  }

  return (
    <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="w-full">
        <TabsTrigger value="all" className="flex-1">
          All Industries
        </TabsTrigger>
        <TabsTrigger value="active" className="flex-1">
          Active
        </TabsTrigger>
        <TabsTrigger value="inactive" className="flex-1">
          Inactive
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="space-y-4">
        {isMobile ? (
          <IndustryListMobile industries={filteredIndustries.all} />
        ) : (
          <IndustryList industries={filteredIndustries.all} />
        )}
      </TabsContent>
      <TabsContent value="active" className="space-y-4">
        {isMobile ? (
          <IndustryListMobile industries={filteredIndustries.active} />
        ) : (
          <IndustryList industries={filteredIndustries.active} />
        )}
      </TabsContent>
      <TabsContent value="inactive" className="space-y-4">
        {isMobile ? (
          <IndustryListMobile industries={filteredIndustries.inactive} />
        ) : (
          <IndustryList industries={filteredIndustries.inactive} />
        )}
      </TabsContent>
    </Tabs>
  )
}
