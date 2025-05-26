"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserList } from "@/components/user/user-list"
import { UserListMobile } from "@/components/user/user-list-mobile"
import type { User } from "@/types/user"

interface UserTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
  users: User[]
  onView: (userId: string) => void
  onEdit: (userId: string) => void
  onDelete: (user: User) => void
}

export function UserTabs({ activeTab, onTabChange, users, onView, onEdit, onDelete }: UserTabsProps) {
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
          <UserList users={users} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <UserListMobile users={users} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        )}
      </TabsContent>
      <TabsContent value="active" className="mt-6">
        {isDesktop ? (
          <UserList users={users} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <UserListMobile users={users} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        )}
      </TabsContent>
      <TabsContent value="inactive" className="mt-6">
        {isDesktop ? (
          <UserList users={users} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <UserListMobile users={users} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        )}
      </TabsContent>
    </Tabs>
  )
}
