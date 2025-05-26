"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DepartmentList } from "@/components/department/department-list"
import { DepartmentListMobile } from "@/components/department/department-list-mobile"
import type { Department } from "@/types/department"

interface DepartmentTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
  departments: Department[]
  onViewRoles: (departmentId: string) => void
  onEdit: (departmentId: string) => void
  onDelete: (department: Department) => void
}

export function DepartmentTabs({
  activeTab,
  onTabChange,
  departments,
  onViewRoles,
  onEdit,
  onDelete,
}: DepartmentTabsProps) {
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
          <DepartmentList departments={departments} onViewRoles={onViewRoles} onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <DepartmentListMobile
            departments={departments}
            onViewRoles={onViewRoles}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </TabsContent>
      <TabsContent value="active" className="mt-6">
        {isDesktop ? (
          <DepartmentList departments={departments} onViewRoles={onViewRoles} onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <DepartmentListMobile
            departments={departments}
            onViewRoles={onViewRoles}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </TabsContent>
      <TabsContent value="inactive" className="mt-6">
        {isDesktop ? (
          <DepartmentList departments={departments} onViewRoles={onViewRoles} onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <DepartmentListMobile
            departments={departments}
            onViewRoles={onViewRoles}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </TabsContent>
    </Tabs>
  )
}
