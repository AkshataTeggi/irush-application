import { API_BASE_URL } from "./constants"

// API configuration for RFQ options
const API_ENDPOINTS = {
  services: "/services",
  specifications: "/specifications",
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

export interface Service {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface Specification {
  id: string
  name: string
  value: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

/**
 * Fetches all services from the API
 */
export async function fetchServices(): Promise<Service[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.services}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.warn(`Failed to fetch services: HTTP ${response.status}`)
      return [] // Return empty array instead of throwing error
    }

    const services = await response.json()

    // Filter only active services
    return services.filter((service: Service) => service.isActive === true)
  } catch (error) {
    console.error("Error fetching services:", error)
    return [] // Return empty array if fetch fails
  }
}

/**
 * Fetches all specifications from the API
 */
export async function fetchSpecifications(): Promise<Specification[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.specifications}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.warn(`Failed to fetch specifications: HTTP ${response.status}`)
      return [] // Return empty array instead of throwing error
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching specifications:", error)
    return [] // Return empty array if fetch fails
  }
}
