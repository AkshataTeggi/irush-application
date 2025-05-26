import { NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/constants"

/**
 * Request password reset endpoint handler
 * Sends a password reset email to the user
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Add timeout for the request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

    try {
      // Call your NestJS backend
      const response = await fetch(`${API_BASE_URL}/auth/request-password-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        return NextResponse.json(
          { message: data.message || "Failed to request password reset" },
          { status: response.status },
        )
      }

      // Return success message
      return NextResponse.json({
        message: data.message || "Password reset email sent",
        resetToken: data.resetToken, // Only in development, should be removed in production
      })
    } catch (fetchError) {
      console.error("Password reset request fetch error:", fetchError)

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
    console.error("Password reset request error:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
