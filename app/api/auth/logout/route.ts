import { NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/constants"

/**
 * Logout endpoint handler
 * Logs out the user and invalidates their session
 */
export async function POST() {
  try {
    // Add timeout for the request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

    try {
      // Call your NestJS backend
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        return NextResponse.json({ message: data.message || "Failed to logout" }, { status: response.status })
      }

      // Return success message
      return NextResponse.json({
        message: data.message || "Logged out successfully",
      })
    } catch (fetchError) {
      console.error("Logout fetch error:", fetchError)

      if (fetchError instanceof Error) {
        if (fetchError.name === "AbortError") {
          return NextResponse.json({ message: "Request timed out" }, { status: 504 })
        } else {
          return NextResponse.json({ message: "Failed to connect to authentication service" }, { status: 503 })
        }
      }

      throw fetchError
    }
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
