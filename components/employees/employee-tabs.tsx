"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Employee } from "@/types/employee"
import { EmployeeList } from "./employee-list"
import { EmployeeListMobile } from "./employee-list-mobile"

interface EmployeeTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
  employees: Employee[]
  onView: (employeeId: string) => void
  onEdit: (employeeId: string) => void
  onDelete: (employee: Employee) => void
}

export function EmployeeTabs({ activeTab, onTabChange, employees, onView, onEdit, onDelete }: EmployeeTabsProps) {
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
          <EmployeeList employees={employees} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <EmployeeListMobile employees={employees} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        )}
      </TabsContent>
      <TabsContent value="active" className="mt-6">
        {isDesktop ? (
          <EmployeeList employees={employees} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <EmployeeListMobile employees={employees} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        )}
      </TabsContent>
      <TabsContent value="inactive" className="mt-6">
        {isDesktop ? (
          <EmployeeList employees={employees} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <EmployeeListMobile employees={employees} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        )}
      </TabsContent>
    </Tabs>
  )
}
