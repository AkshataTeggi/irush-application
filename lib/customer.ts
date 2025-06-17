import type { CreateCustomerDto, UpdateCustomerDto, Customer, CustomerSearchParams } from "@/types/customer"
import { API_BASE_URL } from "./constants"

// API configuration
const API_ENDPOINTS = {
  customers: "/customer",
  search: "/customer/search",
  searchByDate: "/customer/search-by-date",
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
 * Fetches all customers from the API
 */
export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.customers}`, {
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
    handleApiError(error, "Fetch customers")
  }
}

/**
 * Fetches a single customer by ID
 */
export async function fetchCustomerById(id: string): Promise<Customer> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.customers}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Customer not found")
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    handleApiError(error, `Fetch customer ${id}`)
  }
}

/**
 * Creates a new customer
 */
export async function createCustomer(customer: CreateCustomerDto): Promise<Customer> {
  try {
    console.log("Creating customer with data:", customer)

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.customers}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("API Error Response:", errorData)

      if (response.status === 400) {
        // Handle validation errors
        if (errorData.message && Array.isArray(errorData.message)) {
          throw new Error(`Validation failed: ${errorData.message.join(", ")}`)
        }
        throw new Error(errorData.message || "Invalid customer data provided")
      }

      if (response.status === 409) {
        throw new Error("A customer with this email already exists")
      }

      if (response.status === 500) {
        // Handle Prisma foreign key constraint errors
        if (errorData.message && errorData.message.includes("Foreign key constraint")) {
          if (errorData.message.includes("salesmanId")) {
            throw new Error("Foreign key constraint violated: The selected salesman does not exist or is invalid")
          } else if (errorData.message.includes("industryId")) {
            throw new Error("Foreign key constraint violated: The selected industry type is invalid")
          } else if (errorData.message.includes("taxId")) {
            throw new Error("Foreign key constraint violated: The selected tax type is invalid")
          } else if (errorData.message.includes("creditTermId")) {
            throw new Error("Foreign key constraint violated: The selected credit term is invalid")
          } else {
            throw new Error("Foreign key constraint violated: One or more selected options are invalid")
          }
        }
        // Handle Prisma unique constraint errors
        if (errorData.message && errorData.message.includes("Unique constraint")) {
          throw new Error("A customer with this email already exists")
        }
        throw new Error(errorData.message || "Internal server error occurred")
      }

      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const createdCustomer = await response.json()
    console.log("Customer created successfully:", createdCustomer)
    return createdCustomer
  } catch (error) {
    console.error("Create customer error:", error)
    handleApiError(error, "Create customer")
  }
}

/**
 * Updates an existing customer
 */
export async function updateCustomer(id: string, customer: UpdateCustomerDto): Promise<Customer> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.customers}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Customer not found")
      }

      if (response.status === 400) {
        const errorData = await response.json().catch(() => ({}))
        if (errorData.message && Array.isArray(errorData.message)) {
          throw new Error(`Validation failed: ${errorData.message.join(", ")}`)
        }
        throw new Error(errorData.message || "Invalid customer data provided")
      }

      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    handleApiError(error, `Update customer ${id}`)
  }
}

/**
 * Deletes a customer
 */
export async function deleteCustomer(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.customers}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Customer not found")
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Handle successful deletion (may return 200 with data or 204 with no content)
    if (response.status !== 204 && response.headers.get("content-length") !== "0") {
      await response.json()
    }
  } catch (error) {
    handleApiError(error, `Delete customer ${id}`)
  }
}

/**
 * Search customers by name or email
 */
export async function searchCustomers(params: CustomerSearchParams): Promise<{
  customers: Customer[]
  total: number
  page: number
  limit: number
}> {
  try {
    const searchParams = new URLSearchParams()

    if (params.query) searchParams.append("query", params.query)
    if (params.page) searchParams.append("page", params.page.toString())
    if (params.limit) searchParams.append("limit", params.limit.toString())

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.search}?${searchParams}`, {
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
    handleApiError(error, "Search customers")
  }
}

/**
 * Search customers by date range
 */
export async function searchCustomersByDate(params: CustomerSearchParams): Promise<{
  customers: Customer[]
  total: number
  page: number
  limit: number
}> {
  try {
    const searchParams = new URLSearchParams()

    if (params.fromDate) searchParams.append("fromDate", params.fromDate)
    if (params.toDate) searchParams.append("toDate", params.toDate)
    if (params.page) searchParams.append("page", params.page.toString())
    if (params.limit) searchParams.append("limit", params.limit.toString())

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.searchByDate}?${searchParams}`, {
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
    handleApiError(error, "Search customers by date")
  }
}
