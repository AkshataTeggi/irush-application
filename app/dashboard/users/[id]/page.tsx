"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { UserDetail } from "@/components/user/user-detail"
import { UserLoading } from "@/components/user/user-loading"
import { UserError } from "@/components/user/user-error"
import { fetchUserById } from "@/lib/user"
import type { User } from "@/types/user"

export default function UserDetailPage() {
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
    router.push("/dashboard/users")
  }

  const handleEdit = () => {
    router.push(`/dashboard/users/${userId}/edit`)
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

  return <UserDetail user={user} onBack={handleBack} onEdit={handleEdit} />
}
