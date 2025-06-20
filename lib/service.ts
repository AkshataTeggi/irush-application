import { CreateServiceDto, UpdateServiceDto } from "@/types/service"
import { API_BASE_URL } from "./constants"
import { Service } from "./rfq-option"

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

// Fetch all services
export async function fetchServices(): Promise<Service[]> {
  try {
    console.log("Fetching services from:", `${API_BASE_URL}/services`)

    const response = await fetch(`${API_BASE_URL}/services`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const services = await response.json()
    console.log("Services fetched successfully:", services)
    return services
  } catch (error) {
    handleApiError(error, "Fetch services")
  }
}

// Fetch service by ID
export async function fetchServiceById(id: string): Promise<Service> {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const service = await response.json()
    return service
  } catch (error) {
    handleApiError(error, "Fetch service")
  }
}

// Create new service
export async function createService(serviceData: CreateServiceDto): Promise<Service> {
  try {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviceData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const service = await response.json()
    return service
  } catch (error) {
    handleApiError(error, "Create service")
  }
}

// Update service
export async function updateService(id: string, serviceData: UpdateServiceDto): Promise<Service> {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviceData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const service = await response.json()
    return service
  } catch (error) {
    handleApiError(error, "Update service")
  }
}

// Delete service
export async function deleteService(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    handleApiError(error, "Delete service")
  }
}
