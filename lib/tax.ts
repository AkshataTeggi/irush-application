import { CreateTaxDto, UpdateTaxDto } from "@/types/ṭax"
import { API_BASE_URL } from "./constants"
import { Tax } from "./customer-options"


export async function fetchTaxes(): Promise<Tax[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/tax`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch taxes: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error("Invalid response format: expected array")
    }

    return data
  } catch (error) {
    console.error("Error fetching taxes:", error)
    throw error
  }
}

export async function fetchTaxById(id: string): Promise<Tax> {
  try {
    const response = await fetch(`${API_BASE_URL}/tax/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch tax: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching tax:", error)
    throw error
  }
}

export async function createTax(taxData: CreateTaxDto): Promise<Tax> {
  try {
    const response = await fetch(`${API_BASE_URL}/tax`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taxData),
    })

    if (!response.ok) {
      throw new Error(`Failed to create tax: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating tax:", error)
    throw error
  }
}

export async function updateTax(id: string, taxData: UpdateTaxDto): Promise<Tax> {
  try {
    const response = await fetch(`${API_BASE_URL}/tax/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taxData),
    })

    if (!response.ok) {
      throw new Error(`Failed to update tax: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating tax:", error)
    throw error
  }
}

export async function deleteTax(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/tax/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to delete tax: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.error("Error deleting tax:", error)
    throw error
  }
}
