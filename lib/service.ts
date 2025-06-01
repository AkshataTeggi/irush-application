import { Service } from "./rfq-option"
import { API_BASE_URL } from "./constants"
import { CreateServiceDto, UpdateServiceDto } from "@/types/service"


export async function fetchServices(): Promise<Service[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/services`)
    if (!response.ok) {
      throw new Error("Failed to fetch services")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching services:", error)
    throw error
  }
}

export async function fetchServiceById(id: string): Promise<Service> {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch service")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching service:", error)
    throw error
  }
}

export async function createService(data: CreateServiceDto): Promise<Service> {
  try {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to create service")
    }
    return await response.json()
  } catch (error) {
    console.error("Error creating service:", error)
    throw error
  }
}

export async function updateService(id: string, data: UpdateServiceDto): Promise<Service> {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to update service")
    }
    return await response.json()
  } catch (error) {
    console.error("Error updating service:", error)
    throw error
  }
}

export async function deleteService(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("Failed to delete service")
    }
  } catch (error) {
    console.error("Error deleting service:", error)
    throw error
  }
}
