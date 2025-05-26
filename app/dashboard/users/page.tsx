"use client"

import { useState, useEffect } from "react"
import { UserHeader } from "@/components/user/user-header"
import { UserTabs } from "@/components/user/user-tabs"
import { DeleteConfirmDialog } from "@/components/department/delete-confirm-dialog"
import { UserLoading } from "@/components/user/user-loading"
import { UserError } from "@/components/user/user-error"
import { fetchUsers, deleteUser } from "@/lib/user"
import type { User } from "@/types/user"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchUsers()
      setUsers(data)
    } catch (err) {
      setError("Error loading users. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      await deleteUser(selectedUser.id)
      await loadUsers()
      setIsDeleteDialogOpen(false)
    } catch (err) {
      console.error(err)
      setError("Failed to delete user. Please try again.")
    }
  }

  const handleDeleteUserClick = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const filteredUsers = users.filter((user) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return user.status === "active"
    if (activeTab === "inactive") return user.status !== "active"
    return true
  })

  if (isLoading) {
    return <UserLoading />
  }

  if (error) {
    return <UserError error={error} />
  }

  return (
    <div className="space-y-6">
      <UserHeader />

      <UserTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        users={filteredUsers}
        onView={() => {}} // Now handled by router navigation
        onEdit={() => {}} // Now handled by router navigation
        onDelete={handleDeleteUserClick}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteUser}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
      />
    </div>
  )
}
