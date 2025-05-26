import type { CreditTerm, CreateCreditTermDto, UpdateCreditTermDto, CreditTermSearchParams } from "@/types/credit-term"

// API configuration
const API_BASE_URL = "http://irush-server.rushpcb.com:5000"
const API_ENDPOINTS = {
  creditTerms: "/credit-terms",
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
 * Fetches all credit terms from the API
 */
export async function fetchCreditTerms(params?: CreditTermSearchParams): Promise<CreditTerm[]> {
  try {
    const url = new URL(`${API_BASE_URL}${API_ENDPOINTS.creditTerms}`)

    if (params?.query) {
      url.searchParams.append("search", params.query)
    }
    if (params?.isActive !== undefined) {
      url.searchParams.append("isActive", params.isActive.toString())
    }
    if (params?.page) {
      url.searchParams.append("page", params.page.toString())
    }
    if (params?.limit) {
      url.searchParams.append("limit", params.limit.toString())
    }

    const response = await fetch(url.toString(), {
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
    handleApiError(error, "Fetch credit terms")
  }
}

/**
 * Fetches a single credit term by ID
 */
export async function fetchCreditTermById(id: string): Promise<CreditTerm> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.creditTerms}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Credit term not found")
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    handleApiError(error, "Fetch credit term")
  }
}

/**
 * Creates a new credit term
 */
export async function createCreditTerm(creditTermData: CreateCreditTermDto): Promise<CreditTerm> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.creditTerms}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(creditTermData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      if (errorData?.message) {
        throw new Error(errorData.message)
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    handleApiError(error, "Create credit term")
  }
}

/**
 * Updates an existing credit term
 */
export async function updateCreditTerm(id: string, creditTermData: UpdateCreditTermDto): Promise<CreditTerm> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.creditTerms}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(creditTermData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      if (errorData?.message) {
        throw new Error(errorData.message)
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    handleApiError(error, "Update credit term")
  }
}

/**
 * Deletes a credit term
 */
export async function deleteCreditTerm(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.creditTerms}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      if (errorData?.message) {
        throw new Error(errorData.message)
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    handleApiError(error, "Delete credit term")
  }
}
