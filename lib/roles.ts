import { API_BASE_URL } from "./constants"

// API configuration for roles
const API_ENDPOINTS = {
  roles: "/authorization/roles",
}

export interface Role {
  id: string
  name: string
  description: string
  departmentId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  createdBy: string | null
}

/**
 * Helper function to handle API errors consistently
 */
function handleApiError(error: unknown, operation: string): never {
  console.error(`${operation} error:`, error)

  if (error instanceof Error) {
    throw new Error(`${operation} failed: ${error.message}`)
  }

  throw new Error(`${operation} failed: Unknown error`)
}

/**
 * Fetches all roles from the authorization endpoint
 */
export async function fetchRoles(): Promise<Role[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.roles}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const roles = await response.json()

    // Sort roles by name for better UX
    return roles.sort((a: Role, b: Role) => a.name.localeCompare(b.name))
  } catch (error) {
    handleApiError(error, "Fetch roles")
  }
}
