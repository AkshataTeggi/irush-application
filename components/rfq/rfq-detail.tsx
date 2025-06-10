// "use client"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import { Badge } from "@/components/ui/badge"
// import { RFQStatusBadge } from "@/components/rfq/rfq-status-badge"
// import {
//   Edit,
//   FileText,
//   Package,
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Building,
//   Calendar,
//   Settings,
//   Download,
// } from "lucide-react"
// import type { RFQ } from "@/types/rfq"

// interface RFQDetailProps {
//   rfq: RFQ
//   onBack: () => void
//   onEdit: () => void
// }

// export function RFQDetail({ rfq, onBack, onEdit }: RFQDetailProps) {
//   const handleFileDownload = (file: any) => {
//     // In a real implementation, this would handle file download
//     console.log("Download file:", file)
//     // You could implement actual file download logic here
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold">RFQ Details</h1>
//         <div className="flex space-x-2">
//           <Button variant="outline" onClick={onBack}>
//             Back to RFQs
//           </Button>
//           <Button onClick={onEdit}>
//             <Edit className="mr-1 h-4 w-4" /> Edit RFQ
//           </Button>
//         </div>
//       </div>

//       <Card>
//         <CardContent className="mt-5 space-y-6">
//           {/* RFQ Basic Information */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold">RFQ Information</h3>
//               <RFQStatusBadge status={rfq.status} />
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               <div>
//                 <h4 className="text-sm font-medium">RFQ ID</h4>
//                 <p className="text-sm text-muted-foreground font-mono break-all">{rfq.id}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium">Title</h4>
//                 <p className="text-sm text-muted-foreground">{rfq.title}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium">Quantity</h4>
//                 <div className="flex items-center text-sm text-muted-foreground">
//                   <Package className="mr-1 h-3 w-3" />
//                   {rfq.quantity}
//                 </div>
//               </div>
//               <div className="md:col-span-2 lg:col-span-3">
//                 <h4 className="text-sm font-medium">Description</h4>
//                 <p className="text-sm text-muted-foreground">{rfq.description}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium">Created At</h4>
//                 <div className="flex items-center text-sm text-muted-foreground">
//                   <Calendar className="mr-1 h-3 w-3" />
//                   {new Date(rfq.createdAt).toLocaleString()}
//                 </div>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium">Updated At</h4>
//                 <div className="flex items-center text-sm text-muted-foreground">
//                   <Calendar className="mr-1 h-3 w-3" />
//                   {new Date(rfq.updatedAt).toLocaleString()}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <Separator className="dark:bg-slate-700" />

//           {/* Customer Information */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Customer Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               <div>
//                 <h4 className="text-sm font-medium">Customer ID</h4>
//                 <p className="text-sm text-muted-foreground font-mono break-all">{rfq.customer.id}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium">Name</h4>
//                 <div className="flex items-center text-sm text-muted-foreground">
//                   <User className="mr-1 h-3 w-3" />
//                   {rfq.customer.name}
//                 </div>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium">Email</h4>
//                 <div className="flex items-center text-sm text-muted-foreground">
//                   <Mail className="mr-1 h-3 w-3" />
//                   {rfq.customer.email}
//                 </div>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium">Phone</h4>
//                 <div className="flex items-center text-sm text-muted-foreground">
//                   <Phone className="mr-1 h-3 w-3" />
//                   {rfq.customer.phone}
//                 </div>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium">Industry</h4>
//                 <div className="flex items-center text-sm text-muted-foreground">
//                   <Building className="mr-1 h-3 w-3" />
//                   {rfq.customer.industryType?.name || "Not specified"}
//                 </div>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium">Status</h4>
//                 <Badge
//                   className={
//                     rfq.customer.status === "active"
//                       ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
//                       : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
//                   }
//                 >
//                   {rfq.customer.status}
//                 </Badge>
//               </div>
//               {rfq.customer.address && (
//                 <div className="md:col-span-2 lg:col-span-3">
//                   <h4 className="text-sm font-medium">Address</h4>
//                   <div className="flex items-start text-sm text-muted-foreground">
//                     <MapPin className="mr-1 h-3 w-3 mt-0.5" />
//                     <div>
//                       <div>{rfq.customer.address}</div>
//                       <div>
//                         {rfq.customer.city}, {rfq.customer.state} {rfq.customer.zipCode}
//                       </div>
//                       <div>{rfq.customer.country}</div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           <Separator className="dark:bg-slate-700" />

//           {/* Services Information */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Services</h3>
//             {rfq.services.length > 0 ? (
//               <div className="grid gap-4 md:grid-cols-2">
//                 {rfq.services.map((service) => (
//                   <div key={service.id} className="rounded-md border p-4 dark:border-slate-700">
//                     <div className="flex items-start justify-between mb-2">
//                       <div>
//                         <h4 className="font-medium flex items-center">
//                           <Settings className="mr-1 h-4 w-4" />
//                           {service.name}
//                         </h4>
//                         <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
//                       </div>
//                       <Badge variant={service.isActive ? "default" : "secondary"}>
//                         {service.isActive ? "Active" : "Inactive"}
//                       </Badge>
//                     </div>
//                     <div className="text-xs text-muted-foreground">
//                       <p>Created: {new Date(service.createdAt).toLocaleDateString()}</p>
//                       <p>Updated: {new Date(service.updatedAt).toLocaleDateString()}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="flex items-center justify-center h-20 bg-muted rounded-lg dark:bg-slate-800">
//                 <p className="text-muted-foreground">No services associated with this RFQ</p>
//               </div>
//             )}
//           </div>

//           <Separator className="dark:bg-slate-700" />

//           {/* Files Information */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Attached Files</h3>
//             {rfq.files.length > 0 ? (
//               <div className="grid gap-4 md:grid-cols-2">
//                 {rfq.files.map((file) => (
//                   <div key={file.id} className="rounded-md border p-4 dark:border-slate-700">
//                     <div className="flex items-start justify-between mb-2">
//                       <div className="flex-1">
//                         <h4 className="font-medium flex items-center">
//                           <FileText className="mr-1 h-4 w-4" />
//                           {file.originalname}
//                         </h4>
//                         <p className="text-sm text-muted-foreground">System: {file.filename}</p>
//                         <p className="text-xs text-muted-foreground">
//                           {file.mimetype} • {(file.size / 1024).toFixed(1)} KB
//                         </p>
//                       </div>
//                       <Button variant="outline" size="sm" onClick={() => handleFileDownload(file)} className="ml-2">
//                         <Download className="h-3 w-3" />
//                       </Button>
//                     </div>
//                     <div className="text-xs text-muted-foreground">
//                       <p>Version: {file.version}</p>
//                       <p>Storage: {file.storageType}</p>
//                       <p>Uploaded: {new Date(file.createdAt).toLocaleDateString()}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="flex items-center justify-center h-20 bg-muted rounded-lg dark:bg-slate-800">
//                 <p className="text-muted-foreground">No files attached to this RFQ</p>
//               </div>
//             )}
//           </div>

//           <Separator className="dark:bg-slate-700" />

//           {/* Specifications Information */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Specifications</h3>
//             {rfq.rfqSpecifications.length > 0 ? (
//               <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
//                 {rfq.rfqSpecifications.map((spec, index) => (
//                   <div key={spec.specification.id || index} className="rounded-md border p-3 dark:border-slate-700">
//                     <h4 className="font-medium text-sm">{spec.specification.name}</h4>
//                     <p className="text-sm text-muted-foreground">{spec.specification.value}</p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="flex items-center justify-center h-20 bg-muted rounded-lg dark:bg-slate-800">
//                 <p className="text-muted-foreground">No specifications defined for this RFQ</p>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }























"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { RFQStatusBadge } from "@/components/rfq/rfq-status-badge"
import {
  Edit,
  FileText,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Settings,
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import type { RFQ } from "@/types/rfq"

// Base URL for API calls
const API_BASE_URL = "http://irush-server.rushpcb.com:5000"

interface RFQDetailProps {
  rfq: RFQ
  onBack: () => void
  onEdit: () => void
}

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

export function RFQDetailWithImport({ rfq, onBack, onEdit }: RFQDetailProps) {
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
        setError("Please select a valid Excel file (.xls or .xlsx)")
        return
      }

      setSelectedFile(file)
      setError(null)
    }
  }

  const processExcelFile = async (file: File): Promise<ExcelProcessingResult> => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      // Call your backend server with the provided base URL
      const response = await fetch(`${API_BASE_URL}/rfqs/${rfq.id}/upload-excel`, {
        method: "POST",
        body: formData,
        headers: {
          // Don't set Content-Type header when using FormData - browser will set it automatically with boundary
        },
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
      setError("Please select a file first")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)
    setSuccess(null)

    try {
      console.log(`Processing file: ${selectedFile.name}, Size: ${formatFileSize(selectedFile.size)}`)
      console.log(`Uploading to: ${API_BASE_URL}/rfqs/${rfq.id}/upload-excel`)

      // Show progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 500)

      // Process the Excel file using your backend service
      const result = await processExcelFile(selectedFile)

      clearInterval(progressInterval)
      setUploadProgress(100)

      setProcessingResult(result)
      setSuccess(
        `Excel file "${selectedFile.name}" processed successfully! Extracted ${result.extractedSpecs.length} specifications and ${result.extractedAssembly.length} assembly items.`,
      )
      setSelectedFile(null)

      // Reset file input
      const fileInput = document.getElementById("excel-file-input") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "File processing failed")
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const handleFileDownload = (file: any) => {
    // Implement file download logic with base URL
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">RFQ Details</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onBack}>
            Back to RFQs
          </Button>
          <Button onClick={onEdit}>
            <Edit className="mr-1 h-4 w-4" /> Edit RFQ
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="mt-5 space-y-6">
          {/* RFQ Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">RFQ Information</h3>
              <RFQStatusBadge status={rfq.status} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <div>
                <h4 className="text-sm font-medium">RFQ ID</h4>
                <p className="text-sm text-muted-foreground font-mono break-all">{rfq.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Title</h4>
                <p className="text-sm text-muted-foreground">{rfq.title}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Quantity</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Package className="mr-1 h-3 w-3" />
                  {rfq.quantity}
                </div>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm text-muted-foreground">{rfq.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Created At</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(rfq.createdAt).toLocaleString()}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Updated At</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(rfq.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <Separator className="dark:bg-slate-700" />

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <div>
                <h4 className="text-sm font-medium">Customer ID</h4>
                <p className="text-sm text-muted-foreground font-mono break-all">{rfq.customer.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Name</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="mr-1 h-3 w-3" />
                  {rfq.customer.name}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Email</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-1 h-3 w-3" />
                  {rfq.customer.email}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Phone</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="mr-1 h-3 w-3" />
                  {rfq.customer.phone}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Industry</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Building className="mr-1 h-3 w-3" />
                  {rfq.customer.industryType?.name || "Not specified"}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Status</h4>
                <Badge
                  className={
                    rfq.customer.status === "active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                  }
                >
                  {rfq.customer.status}
                </Badge>
              </div>
              {rfq.customer.address && (
                <div className="md:col-span-2 lg:col-span-3">
                  <h4 className="text-sm font-medium">Address</h4>
                  <div className="flex items-start text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-3 w-3 mt-0.5" />
                    <div>
                      <div>{rfq.customer.address}</div>
                      <div>
                        {rfq.customer.city}, {rfq.customer.state} {rfq.customer.zipCode}
                      </div>
                      <div>{rfq.customer.country}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator className="dark:bg-slate-700" />

          {/* Services Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            {rfq.services.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {rfq.services.map((service) => (
                  <div key={service.id} className="rounded-md border p-4 dark:border-slate-700">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium flex items-center">
                          <Settings className="mr-1 h-4 w-4" />
                          {service.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                      </div>
                      <Badge variant={service.isActive ? "default" : "secondary"}>
                        {service.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>Created: {new Date(service.createdAt).toLocaleDateString()}</p>
                      <p>Updated: {new Date(service.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-20 bg-muted rounded-lg dark:bg-slate-800">
                <p className="text-muted-foreground">No services associated with this RFQ</p>
              </div>
            )}
          </div>

          <Separator className="dark:bg-slate-700" />

          {/* Files Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Attached Files</h3>
            {rfq.files.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {rfq.files.map((file) => (
                  <div key={file.id} className="rounded-md border p-4 dark:border-slate-700">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium flex items-center">
                          <FileText className="mr-1 h-4 w-4" />
                          {file.originalname}
                        </h4>
                        <p className="text-sm text-muted-foreground">System: {file.filename}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.mimetype} • {formatFileSize(file.size)}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleFileDownload(file)} className="ml-2">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>Version: {file.version}</p>
                      <p>Storage: {file.storageType}</p>
                      <p>Uploaded: {new Date(file.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-20 bg-muted rounded-lg dark:bg-slate-800">
                <p className="text-muted-foreground">No files attached to this RFQ</p>
              </div>
            )}
          </div>

          <Separator className="dark:bg-slate-700" />

          {/* Excel Import Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <FileSpreadsheet className="mr-2 h-5 w-5" />
              Excel Import
            </h3>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upload Excel File</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload Excel files to extract specifications and assembly data.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="excel-file-input">Select Excel File (.xls or .xlsx)</Label>
                  <Input
                    id="excel-file-input"
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
                      Uploading to: {API_BASE_URL}/rfqs/{rfq.id}/upload-excel
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

            {/* Extracted Data Tabs */}
            {processingResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Extracted Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="specifications" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="specifications">
                        Specifications ({processingResult.extractedSpecs.length})
                      </TabsTrigger>
                      <TabsTrigger value="assembly">Assembly ({processingResult.extractedAssembly.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="specifications" className="space-y-4">
                      {processingResult.extractedSpecs.length > 0 ? (
                        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
                          {processingResult.extractedSpecs.map((spec, index) => (
                            <div key={index} className="rounded-md border p-3 dark:border-slate-700">
                              <h4 className="font-medium text-sm">{spec.key}</h4>
                              <p className="text-sm text-muted-foreground">{spec.value}</p>
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
                              <p className="text-sm text-muted-foreground">Quantity: {assembly.quantity}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-20 bg-muted rounded-lg dark:bg-slate-800">
                          <p className="text-muted-foreground">No assembly data extracted</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          <Separator className="dark:bg-slate-700" />

          {/* Specifications Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Specifications</h3>
            {rfq.rfqSpecifications.length > 0 ? (
              <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
                {rfq.rfqSpecifications.map((spec, index) => (
                  <div key={spec.specification.id || index} className="rounded-md border p-3 dark:border-slate-700">
                    <h4 className="font-medium text-sm">{spec.specification.name}</h4>
                    <p className="text-sm text-muted-foreground">{spec.specification.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-20 bg-muted rounded-lg dark:bg-slate-800">
                <p className="text-muted-foreground">No specifications defined for this RFQ</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
