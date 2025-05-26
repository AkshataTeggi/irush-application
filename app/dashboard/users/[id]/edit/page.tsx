"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { UserEdit } from "@/components/user/user-edit"
import { UserLoading } from "@/components/user/user-loading"
import { UserError } from "@/components/user/user-error"
import { fetchUserById } from "@/lib/user"
import type { User } from "@/types/user"

export default function UserEditPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      loadUser()
    }
  }, [userId])

  const loadUser = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchUserById(userId)
      setUser(data)
    } catch (err) {
      setError("Error loading user. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push(`/dashboard/users/${userId}`)
  }

  const handleUpdate = () => {
    // Redirect to user detail page after successful update
    router.push(`/dashboard/users/${userId}`)
  }

  if (isLoading) {
    return <UserLoading />
  }

  if (error) {
    return <UserError error={error} />
  }

  if (!user) {
    return <UserError error="User not found" />
  }

  return <UserEdit user={user} onBack={handleBack} onUpdate={handleUpdate} />
}
