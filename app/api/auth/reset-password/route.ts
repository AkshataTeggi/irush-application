import { NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/constants"

/**
 * Reset password endpoint handler
 * Resets the user's password using a reset token
 */
export async function POST(request: Request) {
  try {
    const { resetToken, newPassword } = await request.json()

    // Add timeout for the request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

    try {
      // Call your NestJS backend
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resetToken, newPassword }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        return NextResponse.json({ message: data.message || "Failed to reset password" }, { status: response.status })
      }

      // Return success message
      return NextResponse.json({
        message: data.message || "Password successfully reset",
      })
    } catch (fetchError) {
      console.error("Password reset fetch error:", fetchError)

      if (fetchError instanceof Error) {
        if (fetchError.name === "AbortError") {
          return NextResponse.json({ message: "Request timed out" }, { status: 504 })
        } else {
          return NextResponse.json({ message: "Failed to connect to password reset service" }, { status: 503 })
        }
      }

      throw fetchError
    }
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
