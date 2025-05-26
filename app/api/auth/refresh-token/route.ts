import { NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/constants"

/**
 * Refresh token endpoint handler
 * Gets a new access token using a refresh token
 */
export async function POST(request: Request) {
  try {
    const { userId, refreshToken } = await request.json()

    // Add timeout for the request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

    try {
      // Call your NestJS backend
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, refreshToken }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        return NextResponse.json({ message: data.message || "Failed to refresh token" }, { status: response.status })
      }

      // Return the new access token
      return NextResponse.json({
        accessToken: data.accessToken,
      })
    } catch (fetchError) {
      console.error("Token refresh fetch error:", fetchError)

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
    console.error("Token refresh error:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
