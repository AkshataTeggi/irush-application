"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Role } from "@/types/role"
import { RoleEdit, RoleUpdate } from "@/components/roles/role-edit"
import { RoleError } from "@/components/roles/role-error"
import { RoleLoading } from "@/components/roles/role-loading"
import { fetchRoleById } from "@/lib/roles"

interface RoleEditPageProps {
  params: Promise<{ id: string }>
}

export default function RoleEditPage({ params }: RoleEditPageProps) {
  const resolvedParams = use(params)
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()

  async function loadRole() {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchRoleById(resolvedParams.id)
      setRole(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load role"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRole()
  }, [resolvedParams.id])

  function handleBack() {
    router.push(`/dashboard/roles/${resolvedParams.id}`)
  }

  if (loading) {
    return <RoleLoading />
  }

  if (error) {
    return <RoleError error={error} onRetry={loadRole} />
  }

  if (!role) {
    return <RoleError error={new Error("Role not found")} onRetry={loadRole} />
  }

  // Ensure departmentName is always a string
  const safeRole = {
    ...role,
    departmentName: role.departmentName ?? "",
  };

  return <RoleUpdate role={safeRole} onBack={handleBack} />
}
