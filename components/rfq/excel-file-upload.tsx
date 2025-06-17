"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, Package, Download } from "lucide-react"
import { API_BASE_URL } from "@/lib/constants"

interface ExtractedSpec {
  key: string
  value: any
}

interface ExtractedAssembly {
  component: string
  quantity: any
}

interface ExcelProcessingResult {
  excelFile: {
    id: string
    fileName: string
    filePath: string
    mimeType: string
  }
  extractedSpecs: ExtractedSpec[]
  extractedAssembly: ExtractedAssembly[]
  extractedImages: string[]
}

interface ExcelFileUploadProps {
  rfqId: string
  onUploadSuccess?: (result: ExcelProcessingResult) => void
  onUploadError?: (error: string) => void
  className?: string
}

export function ExcelFileUpload({ rfqId, onUploadSuccess, onUploadError, className = "" }: ExcelFileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processingResult, setProcessingResult] = useState<ExcelProcessingResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const allowedTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ]
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xls|xlsx)$/i)) {
        const errorMsg = "Please select a valid Excel file (.xls or .xlsx)"
        setError(errorMsg)
        onUploadError?.(errorMsg)
        return
      }

      setSelectedFile(file)
      setError(null)
      setSuccess(null)
    }
  }

  const processExcelFile = async (file: File): Promise<ExcelProcessingResult> => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch(`${API_BASE_URL}/rfqs/${rfqId}/upload-excel`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error processing Excel file:", error)
      throw error
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) {
      const errorMsg = "Please select a file first"
      setError(errorMsg)
      onUploadError?.(errorMsg)
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)
    setSuccess(null)

    try {
      console.log(`Processing file: ${selectedFile.name}, Size: ${formatFileSize(selectedFile.size)}`)
      console.log(`Uploading to: ${API_BASE_URL}/rfqs/${rfqId}/upload-excel`)

      // Show progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 500)

      // Process the Excel file using your backend service
      const result = await processExcelFile(selectedFile)

      clearInterval(progressInterval)
      setUploadProgress(100)

      setProcessingResult(result)
      const successMsg = `Excel file "${selectedFile.name}" processed successfully! Extracted ${result.extractedSpecs.length} specifications and ${result.extractedAssembly.length} assembly items.`
      setSuccess(successMsg)
      setSelectedFile(null)

      // Reset file input
      const fileInput = document.getElementById(`excel-file-input-${rfqId}`) as HTMLInputElement
      if (fileInput) fileInput.value = ""

      // Call success callback
      onUploadSuccess?.(result)
    } catch (err) {
      console.error("Upload error:", err)
      const errorMsg = err instanceof Error ? err.message : "File processing failed"
      setError(errorMsg)
      onUploadError?.(errorMsg)
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const handleFileDownload = (file: any) => {
    const downloadUrl = file.filePath?.startsWith("http") ? file.filePath : `${API_BASE_URL}${file.filePath}`

    const link = document.createElement("a")
    link.href = downloadUrl
    link.download = file.originalname || file.fileName
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const clearResults = () => {
    setProcessingResult(null)
    setSuccess(null)
    setError(null)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        {/* <h3 className="text-lg font-semibold flex items-center">
          <FileSpreadsheet className="mr-2 h-5 w-5" />
          Excel Import
        </h3> */}
        {processingResult && (
          <Button variant="outline" size="sm" onClick={clearResults}>
            Clear Results
          </Button>
        )}
      </div>

      <Card>
        {/* <CardHeader>
          <CardTitle className="text-base">Upload Excel File</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload Excel files to extract specifications and assembly data for RFQ {rfqId}.
          </p>
        </CardHeader> */}
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`excel-file-input-${rfqId}`}>
                {/* Select Excel File (.xls or .xlsx) */}
                </Label>
            <Input
              id={`excel-file-input-${rfqId}`}
              type="file"
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Processing Excel file...</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">
                Uploading to: {API_BASE_URL}/rfqs/{rfqId}/upload-excel
              </p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleFileUpload} disabled={!selectedFile || isUploading} className="w-full">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload and Process
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Extracted Data Display */}
      {processingResult && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Extracted Data</CardTitle>
            {processingResult.excelFile && (
              <Button variant="outline" size="sm" onClick={() => handleFileDownload(processingResult.excelFile)}>
                <Download className="mr-1 h-3 w-3" />
                Download File
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="specifications" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="specifications">
                  Specifications ({processingResult.extractedSpecs.length})
                </TabsTrigger>
                <TabsTrigger value="assembly">Assembly ({processingResult.extractedAssembly.length})</TabsTrigger>
                <TabsTrigger value="images">Images ({processingResult.extractedImages.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="specifications" className="space-y-4">
                {processingResult.extractedSpecs.length > 0 ? (
                  <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
                    {processingResult.extractedSpecs.map((spec, index) => (
                      <div key={index} className="rounded-md border p-3 dark:border-slate-700">
                        <h4 className="font-medium text-sm">{spec.key}</h4>
                        <p className="text-sm text-muted-foreground break-words">{String(spec.value)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-20 bg-muted rounded-lg dark:bg-slate-800">
                    <p className="text-muted-foreground">No specifications extracted</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="assembly" className="space-y-4">
                {processingResult.extractedAssembly.length > 0 ? (
                  <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
                    {processingResult.extractedAssembly.map((assembly, index) => (
                      <div key={index} className="rounded-md border p-3 dark:border-slate-700">
                        <h4 className="font-medium text-sm flex items-center">
                          <Package className="mr-1 h-3 w-3" />
                          {assembly.component}
                        </h4>
                        <p className="text-sm text-muted-foreground">Quantity: {String(assembly.quantity)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-20 bg-muted rounded-lg dark:bg-slate-800">
                    <p className="text-muted-foreground">No assembly data extracted</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="images" className="space-y-4">
                {processingResult.extractedImages.length > 0 ? (
                  <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
                    {processingResult.extractedImages.map((imagePath, index) => (
                      <div key={index} className="rounded-md border p-3 dark:border-slate-700">
                        <p className="text-sm font-medium">Image {index + 1}</p>
                        <p className="text-xs text-muted-foreground break-all">{imagePath}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-20 bg-muted rounded-lg dark:bg-slate-800">
                    <p className="text-muted-foreground">No images extracted</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
















