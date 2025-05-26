import type { CreateEmployeeDto, UpdateEmployeeDto, Employee } from "@/types/employee"
import { API_BASE_URL } from "./constants"

// API configuration
const API_ENDPOINTS = {
  employees: "/employees",
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
 * Fetches all employees from the API
 */
export async function fetchEmployees(): Promise<Employee[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.employees}`, {
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
    handleApiError(error, "Fetch employees")
  }
}

/**
 * Fetches a single employee by ID
 */
export async function fetchEmployeeById(id: string): Promise<Employee> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.employees}/${id}`, {
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
    handleApiError(error, `Fetch employee ${id}`)
  }
}

/**
 * Creates a new employee
 */
export async function createEmployee(employee: CreateEmployeeDto): Promise<Employee> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.employees}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employee),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    handleApiError(error, "Create employee")
  }
}

/**
 * Updates an existing employee
 */
export async function updateEmployee(id: string, employee: UpdateEmployeeDto): Promise<Employee> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.employees}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employee),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    handleApiError(error, `Update employee ${id}`)
  }
}

/**
 * Deletes an employee
 */
export async function deleteEmployee(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.employees}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Handle 204 No Content response for successful deletion
    if (response.status !== 204) {
      await response.json()
    }
  } catch (error) {
    handleApiError(error, `Delete employee ${id}`)
  }
}
