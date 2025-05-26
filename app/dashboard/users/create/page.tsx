"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserCreateForm } from "@/components/user/user-create-form"

export default function CreateUserPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/dashboard/users")
  }

  const handleCancel = () => {
    router.push("/dashboard/users")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create User</h1>
        <Button variant="outline" onClick={handleCancel}>
          Back to Users
        </Button>
      </div>

      <UserCreateForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  )
}
