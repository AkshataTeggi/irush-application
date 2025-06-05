"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { Role } from "@/types/department"
import { fetchRoleById } from "@/lib/roles"
import { RoleDetail } from "@/components/roles/role-detail"

export default function RoleDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRole() {
      try {
        setLoading(true)
        const data = await fetchRoleById(params.id)
        setRole(data)
      } catch (err) {
        setError("Failed to load role")
      } finally {
        setLoading(false)
      }
    }
    loadRole()
  }, [params.id])

  function handleBack() {
    router.push("/dashboard/roles") // or wherever you want
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  if (!role) return <p>Role not found</p>

  return <RoleDetail role={role} onBack={handleBack} />
}
