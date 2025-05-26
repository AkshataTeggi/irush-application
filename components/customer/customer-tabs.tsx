"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerList } from "@/components/customer/customer-list"
import { CustomerListMobile } from "@/components/customer/customer-list-mobile"
import type { Customer } from "@/types/customer"

interface CustomerTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
  customers: Customer[]
  onView: (customerId: string) => void
  onEdit: (customerId: string) => void
  onDelete: (customer: Customer) => void
}

export function CustomerTabs({ activeTab, onTabChange, customers, onView, onEdit, onDelete }: CustomerTabsProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange}>
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="all" className="w-full">
          All
        </TabsTrigger>
        <TabsTrigger value="active" className="w-full">
          Active
        </TabsTrigger>
        <TabsTrigger value="inactive" className="w-full">
          Inactive
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="mt-6">
        {isDesktop ? (
          <CustomerList customers={customers} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <CustomerListMobile customers={customers} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        )}
      </TabsContent>
      <TabsContent value="active" className="mt-6">
        {isDesktop ? (
          <CustomerList
            customers={customers.filter((c) => c.status === "active")}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ) : (
          <CustomerListMobile
            customers={customers.filter((c) => c.status === "active")}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </TabsContent>
      <TabsContent value="inactive" className="mt-6">
        {isDesktop ? (
          <CustomerList
            customers={customers.filter((c) => c.status !== "active")}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ) : (
          <CustomerListMobile
            customers={customers.filter((c) => c.status !== "active")}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </TabsContent>
    </Tabs>
  )
}
