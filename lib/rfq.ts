

import type { CreateRFQDto, UpdateRFQDto, RFQ, RFQFile } from "@/types/rfq"
import { API_BASE_URL } from "./constants"

// API configuration
const API_ENDPOINTS = {
  rfqs: "/rfqs",
  upload: "/upload",
  downloadFile: (rfqId: string, filename: string) => `/upload/download/${rfqId}/${filename}`,
  getFiles: (modelType: string, modelId: string) => `/upload/${modelType}/${modelId}`,
  replaceFile: (rfqId: string, fileId: string) => `/upload/replace/${rfqId}/${fileId}`,
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
 * Fetches all RFQs from the API with optional filters
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
 * Fetches a single RFQ by ID with all relations
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
 * Updates an existing RFQ using PATCH method
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

      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
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
 * Uploads files using the single upload endpoint
 * Handles both general files and Excel files with automatic processing
 */
export async function uploadFiles(files: File[], modelId?: string): Promise<RFQFile[]> {
  try {
    const formData = new FormData()

    // Add all files to the FormData with the field name 'files'
    files.forEach((file) => {
      formData.append("files", file)
    })

    // Add metadata if provided
    if (modelId) {
      const metadata = {
        modelType: "RFQ",
        modelId: modelId,
      }
      formData.append("metadata", JSON.stringify(metadata))
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.upload}`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      if (response.status === 413) {
        throw new Error("File too large (max 1GB)")
      }

      if (response.status === 400) {
        throw new Error(errorData.message || "Invalid file type or format")
      }

      throw new Error(errorData.message || `Upload failed: ${response.status}`)
    }

    const result = await response.json()

    // Handle array response from your controller
    if (Array.isArray(result)) {
      return result.map((file) => ({
        id: file.id,
        filename: file.filename,
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        path: file.path,
        modelType: file.modelType,
        modelId: file.modelId,
      }))
    }

    // Handle single file response
    return [
      {
        id: result.id,
        filename: result.filename,
        originalname: result.originalname,
        size: result.size,
        mimetype: result.mimetype,
        path: result.path,
        modelType: result.modelType,
        modelId: result.modelId,
      },
    ]
  } catch (error) {
    handleApiError(error, "Upload files")
  }
}

/**
 * Downloads a file using the upload controller
 * Matches the GET /upload/download/:rfqId/:filename endpoint
 */
export async function downloadFile(rfqId: string, filename: string): Promise<Blob> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.downloadFile(rfqId, filename)}`, {
      method: "GET",
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("File not found")
      }
      throw new Error(`Download failed: ${response.status}`)
    }

    return await response.blob()
  } catch (error) {
    handleApiError(error, `Download file ${filename}`)
  }
}

/**
 * Gets files for a specific model (RFQ)
 * Matches the GET /upload/:modelType/:modelId endpoint
 */
export async function getFilesByModel(modelType: string, modelId: string): Promise<RFQFile[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.getFiles(modelType, modelId)}`, {
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
    handleApiError(error, `Get files for ${modelType} ${modelId}`)
  }
}

/**
 * Gets files for a specific RFQ
 * Convenience wrapper around getFilesByModel
 */
export async function getFilesByRfq(rfqId: string): Promise<RFQFile[]> {
  return getFilesByModel("RFQ", rfqId)
}

/**
 * Deletes a file
 * Matches the DELETE /upload/:id endpoint
 */
export async function deleteFile(fileId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/upload/${fileId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("File not found")
      }
      throw new Error(`Delete failed: ${response.status}`)
    }
  } catch (error) {
    handleApiError(error, `Delete file ${fileId}`)
  }
}

/**
 * Replaces a file
 * Matches the PUT /upload/replace/:rfqId/:fileId endpoint
 */
export async function replaceFile(rfqId: string, fileId: string, file: File): Promise<RFQFile> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.replaceFile(rfqId, fileId)}`, {
      method: "PUT",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      if (response.status === 404) {
        throw new Error("File not found")
      }

      if (response.status === 400) {
        throw new Error("No file uploaded")
      }

      throw new Error(errorData.message || `Replace failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    handleApiError(error, `Replace file ${fileId}`)
  }
}
