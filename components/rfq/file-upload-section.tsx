"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, FileIcon, Loader2, Upload, X } from "lucide-react"
import type { RFQFile } from "@/types/rfq"

interface FileUploadSectionProps {
  existingFiles?: RFQFile[]
  onFilesChange: (files: { id: string }[]) => void
  disabled?: boolean
  maxFiles?: number
  className?: string
}

export function FileUploadSection({
  existingFiles = [],
  onFilesChange,
  disabled = false,
  maxFiles = 5,
  className,
}: FileUploadSectionProps) {
  const [files, setFiles] = useState<RFQFile[]>(existingFiles)
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Function to upload files to server and get file IDs
  const uploadFiles = async (filesToUpload: File[]): Promise<RFQFile[]> => {
    // This is a simplified version. In a real app, you would use a proper file upload endpoint
    setIsUploading(true)
    setError(null)

    try {
      // Simulate file upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock server response with file IDs
      const uploadedFiles: RFQFile[] = filesToUpload.map((file, index) => ({
        id: `file-${Date.now()}-${index}`,
        filename: file.name,
        path: `/uploads/${file.name}`,
        storageType: "local",
        modelType: "rfq",
        modelId: "",
        version: 1,
        isActive: true,
        metadata: {
          size: file.size,
          type: file.type,
        },
        originalname: file.name,
        mimetype: file.type,
        size: file.size,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))

      return uploadedFiles
    } catch (err) {
      console.error("Error uploading files:", err)
      setError("Failed to upload files. Please try again.")
      return []
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const selectedFiles = Array.from(e.target.files)

    // Check if adding these files would exceed the max limit
    if (files.length + selectedFiles.length > maxFiles) {
      setError(`You can upload a maximum of ${maxFiles} files.`)
      return
    }

    setUploadingFiles(selectedFiles)

    try {
      const uploadedFiles = await uploadFiles(selectedFiles)

      if (uploadedFiles.length) {
        const newFiles = [...files, ...uploadedFiles]
        setFiles(newFiles)
        onFilesChange(newFiles.map((file) => ({ id: file.id })))
      }
    } finally {
      setUploadingFiles([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeFile = (fileId: string) => {
    const newFiles = files.filter((file) => file.id !== fileId)
    setFiles(newFiles)
    onFilesChange(newFiles.map((file) => ({ id: file.id })))
  }

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith("image/")) {
      return <FileIcon className="h-4 w-4 text-blue-500" />
    }
    if (mimetype.includes("pdf")) {
      return <FileIcon className="h-4 w-4 text-red-500" />
    }
    return <FileIcon className="h-4 w-4" />
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="file-upload"
            className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg p-4 cursor-pointer 
            ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/50"}`}
          >
            <div className="flex flex-col items-center justify-center">
              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="mb-1 text-sm font-medium">
                <span className="text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                Supported files: PDF, CAD, Images, etc. (Max: {maxFiles} files)
              </p>
              {isUploading && (
                <div className="mt-2 flex items-center">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  <span className="text-xs">Uploading {uploadingFiles.length} files...</span>
                </div>
              )}
            </div>
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled || isUploading}
            />
          </label>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-2">
            <h4 className="text-sm font-medium mb-2">Uploaded Files ({files.length})</h4>
            <ul className="space-y-2">
              {files.map((file) => (
                <li key={file.id} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                  <div className="flex items-center">
                    {getFileIcon(file.mimetype)}
                    <span className="ml-2 text-sm truncate max-w-[200px]">{file.filename}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {(file.size / 1024).toFixed(0)} KB
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    disabled={disabled || isUploading}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
