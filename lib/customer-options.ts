// API configuration for customer options
const API_BASE_URL = "http://irush-server.rushpcb.com:5000"
const API_ENDPOINTS = {
  industries: "/industries",
  taxes: "/tax",
  creditTerms: "/credit-terms",
  salesmen: "/employees", // Assuming salesmen are employees
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

export interface Industry {
  id: string
  name: string
}

export interface Tax {
  id: string
  name: string
}

export interface CreditTerm {
  id: string
  name: string
}

export interface Salesman {
  id: string
  name: string
  firstName?: string
  lastName?: string
}

/**
 * Fetches all industries from the API
 */
export async function fetchIndustries(): Promise<Industry[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.industries}`, {
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
    handleApiError(error, "Fetch industries")
  }
}

/**
 * Fetches all tax types from the API
 */
export async function fetchTaxes(): Promise<Tax[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.taxes}`, {
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
    handleApiError(error, "Fetch taxes")
  }
}

/**
 * Fetches all credit terms from the API
 */
export async function fetchCreditTerms(): Promise<CreditTerm[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.creditTerms}`, {
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
 * Fetches all employees (potential salesmen) from the API
 * Filters only active employees and validates their data
 */
export async function fetchSalesmen(): Promise<Salesman[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.salesmen}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.warn(`Failed to fetch salesmen: HTTP ${response.status}`)
      return [] // Return empty array instead of throwing error
    }

    const employees = await response.json()

    // Filter only active employees and transform to salesman format
    const validSalesmen = employees
      .filter((employee: any) => {
        // Only include employees that are active and have valid IDs
        return (
          employee.isActive === true && employee.id && typeof employee.id === "string" && employee.id.trim() !== "" // Ensure ID is not empty string
        )
      })
      .map((employee: any) => ({
        id: employee.id,
        name:
          employee.firstName && employee.lastName
            ? `${employee.firstName} ${employee.lastName}`
            : employee.name || `Employee ${employee.id}`,
        firstName: employee.firstName,
        lastName: employee.lastName,
      }))

    console.log(`Loaded ${validSalesmen.length} valid salesmen`)

    // Log the actual IDs for debugging
    console.log(
      "Valid salesman IDs:",
      validSalesmen.map((s: { id: any }) => s.id),
    )

    return validSalesmen
  } catch (error) {
    console.error("Error fetching salesmen:", error)
    // Return empty array if fetch fails, so form can still work without salesmen
    return []
  }
}
