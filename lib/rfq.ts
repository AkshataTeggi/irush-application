import type { CreateRFQDto, UpdateRFQDto, RFQ } from "@/types/rfq"

// API configuration
const API_BASE_URL = "http://irush-server.rushpcb.com:5000"
const API_ENDPOINTS = {
  rfqs: "/rfqs",
  uploadExcel: (rfqId: string) => `/rfqs/${rfqId}/upload-excel`,
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
 * Fetches all RFQs from the API
 */
export async function fetchRFQs(status?: string, customerId?: string): Promise<RFQ[]> {
  try {
    const searchParams = new URLSearchParams()
    if (status) searchParams.append("status", status)
    if (customerId) searchParams.append("customerId", customerId)

    const queryString = searchParams.toString()
    const url = `${API_BASE_URL}${API_ENDPOINTS.rfqs}${queryString ? `?${queryString}` : ""}`

    const response = await fetch(url, {
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
    handleApiError(error, "Fetch RFQs")
  }
}

/**
 * Fetches a single RFQ by ID
 */
export async function fetchRFQById(id: string): Promise<RFQ> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.rfqs}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("RFQ not found")
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    handleApiError(error, `Fetch RFQ ${id}`)
  }
}

/**
 * Creates a new RFQ
 */
export async function createRFQ(rfq: CreateRFQDto): Promise<RFQ> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.rfqs}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rfq),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      if (response.status === 400) {
        if (errorData.message && Array.isArray(errorData.message)) {
          throw new Error(`Validation failed: ${errorData.message.join(", ")}`)
        }
        throw new Error(errorData.message || "Invalid RFQ data provided")
      }

      if (response.status === 404) {
        throw new Error("Customer not found")
      }

      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    handleApiError(error, "Create RFQ")
  }
}

/**
 * Updates an existing RFQ
 */
export async function updateRFQ(id: string, rfq: UpdateRFQDto): Promise<RFQ> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.rfqs}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rfq),
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("RFQ not found")
      }

      const errorData = await response.json().catch(() => ({}))
      if (response.status === 400) {
        if (errorData.message && Array.isArray(errorData.message)) {
          throw new Error(`Validation failed: ${errorData.message.join(", ")}`)
        }
        throw new Error(errorData.message || "Invalid RFQ data provided")
      }

      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    handleApiError(error, `Update RFQ ${id}`)
  }
}

/**
 * Deletes an RFQ
 */
export async function deleteRFQ(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.rfqs}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("RFQ not found")
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Handle successful deletion (may return 200 with data or 204 with no content)
    if (response.status !== 204 && response.headers.get("content-length") !== "0") {
      await response.json()
    }
  } catch (error) {
    handleApiError(error, `Delete RFQ ${id}`)
  }
}

/**
 * Uploads an Excel file for a specific RFQ
 */
export async function uploadExcelFile(rfqId: string, file: File): Promise<any> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.uploadExcel(rfqId)}`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      if (response.status === 404) {
        throw new Error("RFQ not found")
      }

      if (response.status === 400) {
        throw new Error(errorData.message || "Invalid file format")
      }

      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    handleApiError(error, `Upload Excel file for RFQ ${rfqId}`)
  }
}
