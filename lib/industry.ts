import { API_BASE_URL } from "./constants";

// API configuration for industry
const API_ENDPOINT = "/industries"

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
 * Fetches all industries from the API
 */
export async function fetchIndustries(params?: { query?: string; status?: string }) {
  try {
    let url = `${API_BASE_URL}${API_ENDPOINT}`

    // Add query parameters if provided
    if (params) {
      const queryParams = new URLSearchParams()
      if (params.query) queryParams.append("query", params.query)
      if (params.status) queryParams.append("status", params.status)

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`
      }
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const data = await response.json()
    if (!Array.isArray(data)) {
      throw new Error("Invalid response format: expected array")
    }
    return data
  } catch (error) {
    handleApiError(error, "Fetch industries")
  }
}

/**
 * Fetches a single industry by ID
 */
export async function fetchIndustryById(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINT}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    handleApiError(error, "Fetch industry")
  }
}

/**
 * Creates a new industry
 */
export async function createIndustry(data: { name: string; description?: string; status?: string }) {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    handleApiError(error, "Create industry")
  }
}

/**
 * Updates an existing industry
 */
export async function updateIndustry(id: string, data: { name?: string; description?: string; status?: string }) {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINT}/${id}`, {
      method: "PATCH", // Using PATCH as specified in the controller
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    handleApiError(error, "Update industry")
  }
}

/**
 * Deletes an industry
 */
export async function deleteIndustry(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINT}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    handleApiError(error, "Delete industry")
  }
}
