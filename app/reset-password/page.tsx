import { ResetPasswordForm } from "@/components/reset-password-form"

export default function ResetPasswordPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token || ""

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Set New Password</h1>
        <ResetPasswordForm token={token} />
      </div>
    </main>
  )
}
