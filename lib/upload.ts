import { API_BASE_URL } from "./constants"

// Upload multiple files
export async function uploadFiles(formData: FormData) {
  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Upload error:", error)
    throw error
  }
}

// Get files for a specific RFQ
export async function getFiles(modelType: string, modelId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/upload/${modelType}/${modelId}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch files: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Get files error:", error)
    throw error
  }
}

// Delete a file
export async function deleteFile(fileId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/upload/${fileId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Delete error:", error)
    throw error
  }
}

// Replace a file
export async function replaceFile(rfqId: string, fileId: string, file: File) {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_BASE_URL}/upload/replace/${rfqId}/${fileId}`, {
      method: "PUT",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Replace failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Replace error:", error)
    throw error
  }
}

// Download a file
export async function downloadFile(rfqId: string, filename: string, originalName: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/upload/download/${rfqId}/${filename}`)

    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`)
    }

    // Create blob and download
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = originalName
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error("Download error:", error)
    throw error
  }
}

// Get all files
export async function getAllFiles() {
  try {
    const response = await fetch(`${API_BASE_URL}/upload`)

    if (!response.ok) {
      throw new Error(`Failed to fetch all files: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Get all files error:", error)
    throw error
  }
}
