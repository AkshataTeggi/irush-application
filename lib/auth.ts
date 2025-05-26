import { jwtDecode } from "jwt-decode"
import { API_BASE_URL } from "./constants"

interface JwtPayload {
  userId: string
  email: string
  sub: string
  roleId: string
  role: string
  exp: number
}

export function getUser() {
  if (typeof window === "undefined") return null

  const token = localStorage.getItem("accessToken")
  if (!token) return null

  try {
    const decoded = jwtDecode<JwtPayload>(token)

    // Check if token is expired
    const currentTime = Date.now() / 1000
    if (decoded.exp < currentTime) {
      return null
    }

    return {
      id: decoded.userId,
      email: decoded.email,
      roleId: decoded.roleId,
      role: decoded.role,
    }
  } catch (error) {
    console.error("Failed to decode token:", error)
    return null
  }
}

export async function refreshAccessToken() {
  const user = getUser()
  const refreshToken = localStorage.getItem("refreshToken")

  if (!user || !refreshToken) {
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        refreshToken,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to refresh token")
    }

    const data = await response.json()
    localStorage.setItem("accessToken", data.accessToken)

    return true
  } catch (error) {
    console.error("Token refresh failed:", error)
    return false
  }
}

export async function logout() {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
    })
  } catch (error) {
    console.error("Logout error:", error)
  } finally {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    window.location.href = "/app"
  }
}















