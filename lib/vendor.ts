import { Vendor, CreateVendorDto, UpdateVendorDto } from "@/types/vendors"
import { API_BASE_URL } from "./constants"


export async function fetchVendors(): Promise<Vendor[]> {
  const response = await fetch(`${API_BASE_URL}/vendors`, {
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch vendors: ${response.statusText}`)
  }

  const data = await response.json()
  return Array.isArray(data) ? data : []
}

export async function fetchVendorById(id: string): Promise<Vendor> {
  const response = await fetch(`${API_BASE_URL}/vendors/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch vendor: ${response.statusText}`)
  }

  return response.json()
}

export async function createVendor(vendor: CreateVendorDto): Promise<Vendor> {
  const response = await fetch(`${API_BASE_URL}/vendors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vendor),
  })

  if (!response.ok) {
    throw new Error(`Failed to create vendor: ${response.statusText}`)
  }

  return response.json()
}

export async function updateVendor(id: string, vendor: UpdateVendorDto): Promise<Vendor> {
  const response = await fetch(`${API_BASE_URL}/vendors/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vendor),
  })

  if (!response.ok) {
    throw new Error(`Failed to update vendor: ${response.statusText}`)
  }

  return response.json()
}

export async function deleteVendor(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/vendors/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to delete vendor: ${response.statusText}`)
  }
}
