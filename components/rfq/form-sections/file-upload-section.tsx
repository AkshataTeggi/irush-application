// "use client"
// import { useCallback } from "react"
// import type React from "react"

// import { useDropzone } from "react-dropzone"
// import { Upload, X, CheckCircle, AlertCircle, Loader2, FileSpreadsheet, FileText, Cog } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Progress } from "@/components/ui/progress"
// import { Badge } from "@/components/ui/badge"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// interface UploadingFile {
//   file: File
//   id: string
//   progress: number
//   status: "pending" | "uploading" | "completed" | "error" | "processing" | "extracted"
//   error?: string
//   uploadedBytes: number
//   serverData?: {
//     id: string
//     filename: string
//     originalname: string
//     size: number
//     mimetype: string
//   }
//   extractedData?: {
//     specifications: any[]
//     assemblyData: any[]
//     images: any[]
//     totalSpecs: number
//   }
// }

// interface FileUploadSectionProps {
//   uploadingFiles: UploadingFile[]
//   setUploadingFiles: React.Dispatch<React.SetStateAction<UploadingFile[]>>
//   isUploading: boolean
//   fileUploadError: string | null
//   setFileUploadError: React.Dispatch<React.SetStateAction<string | null>>
//   onUploadFiles: () => Promise<void>
//   onRemoveFile: (fileId: string) => void
//   disabled?: boolean
// }

// export function FileUploadSection({
//   uploadingFiles,
//   setUploadingFiles,
//   isUploading,
//   fileUploadError,
//   setFileUploadError,
//   onUploadFiles,
//   onRemoveFile,
//   disabled = false,
// }: FileUploadSectionProps) {
//   const acceptedFileTypes = {
//     "application/zip": [".zip"],
//     "application/x-rar-compressed": [".rar"],
//     "application/vnd.ms-excel": [".xls"],
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
//     "application/msword": [".doc"],
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
//     "text/csv": [".csv"],
//     "application/pdf": [".pdf"],
//     "text/plain": [".txt"],
//     "image/jpeg": [".jpg", ".jpeg"],
//     "image/png": [".png"],
//     "image/svg+xml": [".svg"],
//     "application/octet-stream": [
//       ".sch",
//       ".schdoc",
//       ".cam",
//       ".brd",
//       ".pcb",
//       ".pcbdoc",
//       ".dxf",
//       ".dwg",
//       ".hpgl",
//       ".step",
//       ".stp",
//       ".prjpcb",
//       ".dsn",
//       ".asc",
//       ".job",
//       ".iges",
//       ".igs",
//       ".gbr",
//       ".ger",
//       ".gbl",
//       ".gtl",
//       ".gbs",
//       ".gts",
//       ".gbo",
//       ".gto",
//       ".gm1",
//       ".gko",
//       ".drl",
//       ".xln",
//       ".ncl",
//       ".nsv",
//       ".pos",
//       ".bom",
//       ".fab",
//       ".asm",
//       ".tgz",
//       ".tar.gz",
//       ".xmlz",
//       ".sim",
//       ".net",
//       ".specctra",
//       ".lbr",
//       ".prt",
//     ],
//   }

//   const isExcelFile = (file: File): boolean => {
//     const excelTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
//     const excelExtensions = [".xls", ".xlsx"]
//     const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."))

//     return excelTypes.includes(file.type) || excelExtensions.includes(fileExtension)
//   }

//   const onDrop = useCallback(
//     (acceptedFiles: File[], rejectedFiles: any[]) => {
//       if (disabled) return

//       setFileUploadError(null)

//       if (rejectedFiles.length > 0) {
//         const rejectedNames = rejectedFiles.map((f) => f.file.name).join(", ")
//         setFileUploadError(`Some files were rejected: ${rejectedNames}`)
//       }

//       const validFiles: File[] = []
//       const oversizedFiles: string[] = []

//       acceptedFiles.forEach((file) => {
//         if (file.size > 1024 * 1024 * 1024) {
//           // 1GB limit
//           oversizedFiles.push(file.name)
//         } else {
//           validFiles.push(file)
//         }
//       })

//       if (oversizedFiles.length > 0) {
//         setFileUploadError(`Files exceed 1GB limit: ${oversizedFiles.join(", ")}`)
//       }

//       const newUploadingFiles: UploadingFile[] = validFiles.map((file) => ({
//         file,
//         id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//         progress: 0,
//         status: "pending",
//         uploadedBytes: 0,
//       }))

//       setUploadingFiles((prev) => [...prev, ...newUploadingFiles])
//     },
//     [disabled, setFileUploadError, setUploadingFiles],
//   )

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: acceptedFileTypes,
//     maxSize: 1024 * 1024 * 1024, // 1GB
//     multiple: true,
//     disabled,
//   })

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "extracted":
//         return <CheckCircle className="h-4 w-4 text-green-500" />
//       case "completed":
//         return <CheckCircle className="h-4 w-4 text-blue-500" />
//       case "processing":
//         return <Cog className="h-4 w-4 text-orange-500 animate-spin" />
//       case "error":
//         return <AlertCircle className="h-4 w-4 text-red-500" />
//       case "uploading":
//         return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
//       case "pending":
//         return <div className="h-4 w-4 border-2 border-gray-400 rounded-full bg-gray-100" />
//       default:
//         return <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
//     }
//   }

//   const getFileIcon = (file: File) => {
//     if (isExcelFile(file)) {
//       return <FileSpreadsheet className="h-4 w-4 text-green-600" />
//     }
//     return <FileText className="h-4 w-4 text-blue-600" />
//   }

//   const getStatusText = (uploadingFile: UploadingFile) => {
//     switch (uploadingFile.status) {
//       case "extracted":
//         return `✅ Specifications extracted (${uploadingFile.extractedData?.totalSpecs || 0} specs)`
//       case "processing":
//         return "🔄 Extracting specifications..."
//       case "completed":
//         return isExcelFile(uploadingFile.file) ? "✅ Uploaded - Ready for extraction" : "✅ Upload completed"
//       case "uploading":
//         return `${uploadingFile.progress}% uploaded`
//       case "error":
//         return uploadingFile.error || "Upload failed"
//       case "pending":
//         return "Waiting to upload"
//       default:
//         return ""
//     }
//   }

//   const pendingFiles = uploadingFiles.filter((f) => f.status === "pending")
//   const excelFiles = uploadingFiles.filter((f) => isExcelFile(f.file))
//   const extractedFiles = uploadingFiles.filter((f) => f.status === "extracted")
//   const processingFiles = uploadingFiles.filter((f) => f.status === "processing")

//   return (
//     <div className="space-y-4">
//       <Label className="block mb-2 text-sm font-medium">Upload Files (Up to 1GB each)</Label>

//       {/* Excel Processing Status */}
//       {processingFiles.length > 0 && (
//         <Alert className="bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-400">
//           <Cog className="h-4 w-4 animate-spin" />
//           <AlertDescription>
//             <div className="space-y-1">
//               <p className="font-medium">Processing Excel files...</p>
//               <p className="text-sm">Extracting specifications from {processingFiles.length} Excel file(s).</p>
//             </div>
//           </AlertDescription>
//         </Alert>
//       )}

//       {/* Excel Extraction Success */}
//       {extractedFiles.length > 0 && (
//         <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
//           <CheckCircle className="h-4 w-4" />
//           <AlertDescription>
//             <div className="space-y-1">
//               <p className="font-medium">Excel specifications extracted!</p>
//               <p className="text-sm">
//                 Successfully extracted{" "}
//                 {extractedFiles.reduce((total, file) => total + (file.extractedData?.totalSpecs || 0), 0)}{" "}
//                 specifications from {extractedFiles.length} Excel file(s).
//               </p>
//             </div>
//           </AlertDescription>
//         </Alert>
//       )}

//       {/* Excel File Notice */}
//       {excelFiles.length > 0 && processingFiles.length === 0 && extractedFiles.length === 0 && (
//         <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400">
//           <FileSpreadsheet className="h-4 w-4" />
//           <AlertDescription>
//             <div className="space-y-1">
//               <p className="font-medium">Excel files detected!</p>
//               <p className="text-sm">
//                 Excel files will be processed immediately after upload to extract specifications automatically.
//               </p>
//             </div>
//           </AlertDescription>
//         </Alert>
//       )}

//       {/* Drag & Drop Area */}
//       <div
//         {...getRootProps()}
//         className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
//           isDragActive
//             ? "border-blue-500 bg-blue-50"
//             : disabled
//               ? "border-gray-200 bg-gray-50 cursor-not-allowed"
//               : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
//         }`}
//       >
//         <input {...getInputProps()} disabled={disabled} />
//         <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
//         {isDragActive ? (
//           <p className="text-blue-600">Drop the files here...</p>
//         ) : (
//           <div>
//             <p className="text-gray-600 mb-1">
//               {disabled ? "File upload disabled during submission" : "Drag & drop files here, or click to select"}
//             </p>
//             <p className="text-sm text-gray-500">Supports files up to 1GB each</p>
//           </div>
//         )}
//       </div>

//       {/* Upload Button */}
//       {pendingFiles.length > 0 && !isUploading && !disabled && (
//         <div className="flex justify-center">
//           <Button onClick={onUploadFiles} className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700">
//             <Upload className="mr-2 h-4 w-4" />
//             Upload {pendingFiles.length} File{pendingFiles.length > 1 ? "s" : ""}
//           </Button>
//         </div>
//       )}

//       {/* Upload Progress */}
//       {isUploading && (
//         <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
//           <div className="flex items-center justify-between mb-2">
//             <div className="flex items-center space-x-3">
//               <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
//               <span className="text-sm font-medium text-blue-700">Uploading files...</span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* File List */}
//       {uploadingFiles.length > 0 && (
//         <div className="mt-4">
//           <h4 className="text-sm font-medium mb-2 flex items-center">
//             Selected Files ({uploadingFiles.length})
//             {excelFiles.length > 0 && (
//               <Badge variant="outline" className="ml-2 text-xs">
//                 <FileSpreadsheet className="mr-1 h-3 w-3" />
//                 {excelFiles.length} Excel
//               </Badge>
//             )}
//             {extractedFiles.length > 0 && (
//               <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
//                 ✅ {extractedFiles.length} Processed
//               </Badge>
//             )}
//           </h4>
//           <ul className="space-y-3 max-h-80 overflow-y-auto">
//             {uploadingFiles.map((uploadingFile) => (
//               <li
//                 key={uploadingFile.id}
//                 className={`flex items-center justify-between text-sm p-3 rounded border ${
//                   uploadingFile.status === "extracted"
//                     ? "bg-green-50 border-green-200"
//                     : uploadingFile.status === "completed"
//                       ? "bg-blue-50 border-blue-200"
//                       : uploadingFile.status === "processing"
//                         ? "bg-orange-50 border-orange-200"
//                         : uploadingFile.status === "error"
//                           ? "bg-red-50 border-red-200"
//                           : uploadingFile.status === "uploading"
//                             ? "bg-blue-50 border-blue-200"
//                             : "bg-gray-50 border-gray-200"
//                 }`}
//               >
//                 <div className="flex items-center space-x-3 flex-grow">
//                   {getStatusIcon(uploadingFile.status)}
//                   {getFileIcon(uploadingFile.file)}
//                   <div className="flex-grow">
//                     <div className="flex items-center justify-between">
//                       <span className="truncate font-medium flex items-center">
//                         {uploadingFile.file.name}
//                         {isExcelFile(uploadingFile.file) && (
//                           <Badge variant="secondary" className="ml-2 text-xs">
//                             Excel
//                           </Badge>
//                         )}
//                         {uploadingFile.status === "extracted" && (
//                           <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
//                             Processed
//                           </Badge>
//                         )}
//                       </span>
//                       <span className="text-xs text-gray-500 ml-2">
//                         {uploadingFile.file.size >= 1024 * 1024 * 1024
//                           ? `${(uploadingFile.file.size / (1024 * 1024 * 1024)).toFixed(2)} GB`
//                           : `${(uploadingFile.file.size / (1024 * 1024)).toFixed(2)} MB`}
//                       </span>
//                     </div>

//                     {uploadingFile.status === "uploading" && (
//                       <div className="mt-1">
//                         <Progress value={uploadingFile.progress} className="w-full h-1" />
//                       </div>
//                     )}

//                     <div className="mt-1 text-xs">
//                       <span
//                         className={
//                           uploadingFile.status === "extracted"
//                             ? "text-green-600"
//                             : uploadingFile.status === "processing"
//                               ? "text-orange-600"
//                               : uploadingFile.status === "completed"
//                                 ? "text-blue-600"
//                                 : uploadingFile.status === "error"
//                                   ? "text-red-500"
//                                   : "text-gray-500"
//                         }
//                       >
//                         {getStatusText(uploadingFile)}
//                       </span>
//                     </div>

//                     {uploadingFile.extractedData && (
//                       <div className="mt-1 text-xs text-green-600">
//                         📊 {uploadingFile.extractedData.specifications?.length || 0} specifications,{" "}
//                         {uploadingFile.extractedData.assemblyData?.length || 0} assembly items,{" "}
//                         {uploadingFile.extractedData.images?.length || 0} images
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => onRemoveFile(uploadingFile.id)}
//                   className="h-8 w-8 text-red-500 hover:text-red-700 ml-4"
//                   disabled={disabled || uploadingFile.status === "uploading" || uploadingFile.status === "processing"}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Error Display */}
//       {fileUploadError && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{fileUploadError}</AlertDescription>
//         </Alert>
//       )}

//       {/* File Guidelines */}
//       <Accordion type="single" collapsible className="w-full">
//         <AccordionItem value="file-info">
//           <AccordionTrigger className="text-sm text-green-800 font-medium">
//             Accepted files and upload guidelines
//           </AccordionTrigger>
//           <AccordionContent>
//             <div className="border border-green-200 rounded-md p-4">
//               <p className="text-xs text-green-700 mb-2">
//                 Zip or rar format with BOM/P&P files; XLSX, DOC, CSV, PDF, TXT, CAD/CAM files
//               </p>
//               <div className="text-xs text-green-700 mb-3">
//                 <p className="font-medium mb-1">Supported formats:</p>
//                 <p className="break-words">
//                   zip, rar, xls, xlsx, doc, docx, csv, pdf, txt, sch, schdoc, brd, pcb, pcbdoc, dsn, dxf, dwg, step,
//                   stp, gbr, ger, gbl, gtl, drl, bom, fab, asm, jpg, jpeg, png, svg, and more CAD/PCB formats
//                 </p>
//               </div>
//               <ul className="text-sm text-green-700 list-disc list-inside space-y-1">
//                 <li>Maximum file size: 1GB per file</li>
//                 <li>BOM and P&P files must be included within zip or rar archives</li>
//                 <li>
//                   <strong>Excel files (.xls, .xlsx) are automatically processed</strong> immediately after upload to
//                   extract specifications
//                 </li>
//                 <li>Extracted specifications are automatically populated in the form</li>
//                 <li>Files are automatically versioned when replaced</li>
//                 <li>All uploaded files are stored securely on the server</li>
//               </ul>
//             </div>
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>
//     </div>
//   )
// }


































"use client"
import { useCallback } from "react"
import type React from "react"

import { useDropzone } from "react-dropzone"
import { Upload, X, CheckCircle, AlertCircle, Loader2, FileSpreadsheet, FileText, Cog, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface UploadingFile {
  file: File
  id: string
  progress: number
  status: "pending" | "uploading" | "completed" | "error" | "processing" | "extracted"
  error?: string
  uploadedBytes: number
  serverData?: {
    id: string
    filename: string
    originalname: string
    size: number
    mimetype: string
    path: string
    modelType: string
    modelId?: string
  }
  extractedData?: {
    specifications: any[]
    assemblyData: any[]
    images: any[]
    totalSpecs: number
  }
}

interface FileUploadSectionProps {
  uploadingFiles: UploadingFile[]
  setUploadingFiles: React.Dispatch<React.SetStateAction<UploadingFile[]>>
  isUploading: boolean
  fileUploadError: string | null
  setFileUploadError: React.Dispatch<React.SetStateAction<string | null>>
  onUploadFiles: () => Promise<void>
  onRemoveFile: (fileId: string) => void
  disabled?: boolean
  rfqId?: string
  apiBaseUrl?: string
  onSpecsExtracted?: (specs: any[]) => void // Add this new prop
}

export function FileUploadSection({
  uploadingFiles,
  setUploadingFiles,
  isUploading,
  fileUploadError,
  setFileUploadError,
  onUploadFiles,
  onRemoveFile,
  disabled = false,
  rfqId,
  apiBaseUrl = "/api",
  onSpecsExtracted, // Add this
}: FileUploadSectionProps) {
  const acceptedFileTypes = {
    "application/zip": [".zip"],
    "application/x-rar-compressed": [".rar"],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "text/csv": [".csv"],
    "application/pdf": [".pdf"],
    "text/plain": [".txt"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/svg+xml": [".svg"],
    "application/octet-stream": [
      ".sch",
      ".schdoc",
      ".cam",
      ".brd",
      ".pcb",
      ".pcbdoc",
      ".dxf",
      ".dwg",
      ".hpgl",
      ".step",
      ".stp",
      ".prjpcb",
      ".dsn",
      ".asc",
      ".job",
      ".iges",
      ".igs",
      ".gbr",
      ".ger",
      ".gbl",
      ".gtl",
      ".gbs",
      ".gts",
      ".gbo",
      ".gto",
      ".gm1",
      ".gko",
      ".drl",
      ".xln",
      ".ncl",
      ".nsv",
      ".pos",
      ".bom",
      ".fab",
      ".asm",
      ".tgz",
      ".tar.gz",
      ".xmlz",
      ".sim",
      ".net",
      ".specctra",
      ".lbr",
      ".prt",
    ],
  }

  const isExcelFile = (file: File): boolean => {
    const excelTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
    const excelExtensions = [".xls", ".xlsx"]
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."))

    return excelTypes.includes(file.type) || excelExtensions.includes(fileExtension)
  }

  // Upload files to backend with immediate processing
  const uploadFilesToBackend = async (filesToUpload: UploadingFile[]) => {
    const formData = new FormData()

    // Add files to FormData
    filesToUpload.forEach((uploadingFile) => {
      formData.append("files", uploadingFile.file)
    })

    // Add metadata for immediate processing
    const metadata = {
      rfqId: rfqId || "temp",
      modelType: "RFQ",
      processImmediately: true, // Flag to process Excel files immediately
      extractSpecs: true, // Flag to extract specifications during upload
    }
    formData.append("metadata", JSON.stringify(metadata))

    try {
      const response = await fetch(`${apiBaseUrl}/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()

      // Process the result to extract specifications if available
      if (Array.isArray(result)) {
        result.forEach((fileData, index) => {
          const uploadingFile = filesToUpload[index]
          if (isExcelFile(uploadingFile.file) && fileData.extractedSpecs) {
            // Set extracted data immediately
            setUploadingFiles((prev) =>
              prev.map((f) =>
                f.id === uploadingFile.id
                  ? {
                      ...f,
                      status: "extracted" as const,
                      extractedData: {
                        specifications: fileData.extractedSpecs || [],
                        assemblyData: fileData.extractedAssembly || [],
                        images: fileData.extractedImages || [],
                        totalSpecs: fileData.extractedSpecs?.length || 0,
                      },
                    }
                  : f,
              ),
            )

            // Trigger callback to parent component with extracted specs
            if (onSpecsExtracted && fileData.extractedSpecs) {
              onSpecsExtracted(fileData.extractedSpecs)
            }
          }
        })
      }

      return result
    } catch (error) {
      console.error("Upload error:", error)
      throw error
    }
  }

  // Download file from backend
  const downloadFile = async (fileData: UploadingFile["serverData"]) => {
    if (!fileData || !rfqId) return

    try {
      const response = await fetch(`${apiBaseUrl}/upload/download/${rfqId}/${fileData.filename}`)

      if (!response.ok) {
        throw new Error("Download failed")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileData.originalname || fileData.filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download error:", error)
      setFileUploadError(`Failed to download ${fileData.originalname}`)
    }
  }

  // Replace file in backend
  const replaceFile = async (fileId: string, newFile: File) => {
    if (!rfqId) return

    const formData = new FormData()
    formData.append("file", newFile)

    try {
      const response = await fetch(`${apiBaseUrl}/upload/replace/${rfqId}/${fileId}`, {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("File replacement failed")
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Replace error:", error)
      throw error
    }
  }

  // Delete file from backend
  const deleteFileFromBackend = async (fileId: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/upload/${fileId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Delete failed")
      }

      return await response.json()
    } catch (error) {
      console.error("Delete error:", error)
      throw error
    }
  }

  // Enhanced upload function that integrates with backend
  const handleUploadFiles = async () => {
    const pendingFiles = uploadingFiles.filter((f) => f.status === "pending")
    if (pendingFiles.length === 0) return

    // Update status to uploading
    setUploadingFiles((prev) =>
      prev.map((file) => (file.status === "pending" ? { ...file, status: "uploading" as const, progress: 0 } : file)),
    )

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadingFiles((prev) =>
          prev.map((file) =>
            file.status === "uploading" && file.progress < 90
              ? { ...file, progress: Math.min(file.progress + 10, 90) }
              : file,
          ),
        )
      }, 200)

      // Upload to backend
      const uploadResult = await uploadFilesToBackend(pendingFiles)

      clearInterval(progressInterval)

      // Update files with server response
      setUploadingFiles((prev) =>
        prev.map((file) => {
          if (file.status === "uploading") {
            const serverFile = Array.isArray(uploadResult)
              ? uploadResult.find((sf) => sf.originalname === file.file.name)
              : uploadResult

            return {
              ...file,
              status: "completed" as const,
              progress: 100,
              serverData: serverFile,
            }
          }
          return file
        }),
      )

      // Process Excel files if any
      const excelFiles = pendingFiles.filter((f) => isExcelFile(f.file))
      if (excelFiles.length > 0) {
        // Set processing status for Excel files
        setUploadingFiles((prev) =>
          prev.map((file) =>
            isExcelFile(file.file) && file.status === "completed" ? { ...file, status: "processing" as const } : file,
          ),
        )

        // Simulate Excel processing (replace with actual processing logic)
        setTimeout(() => {
          setUploadingFiles((prev) =>
            prev.map((file) =>
              file.status === "processing"
                ? {
                    ...file,
                    status: "extracted" as const,
                    extractedData: {
                      specifications: [],
                      assemblyData: [],
                      images: [],
                      totalSpecs: Math.floor(Math.random() * 50) + 10,
                    },
                  }
                : file,
            ),
          )
        }, 2000)
      }
    } catch (error) {
      console.error("Upload failed:", error)
      setFileUploadError(error instanceof Error ? error.message : "Upload failed")

      // Reset failed uploads
      setUploadingFiles((prev) =>
        prev.map((file) =>
          file.status === "uploading" ? { ...file, status: "error" as const, error: "Upload failed" } : file,
        ),
      )
    }
  }

  // Enhanced remove function that also deletes from backend
  const handleRemoveFile = async (fileId: string) => {
    const fileToRemove = uploadingFiles.find((f) => f.id === fileId)

    if (fileToRemove?.serverData?.id) {
      try {
        await deleteFileFromBackend(fileToRemove.serverData.id)
      } catch (error) {
        console.error("Failed to delete file from server:", error)
        setFileUploadError("Failed to delete file from server")
        return
      }
    }

    onRemoveFile(fileId)
  }

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (disabled) return

      setFileUploadError(null)

      if (rejectedFiles.length > 0) {
        const rejectedNames = rejectedFiles.map((f) => f.file.name).join(", ")
        setFileUploadError(`Some files were rejected: ${rejectedNames}`)
      }

      const validFiles: File[] = []
      const oversizedFiles: string[] = []

      acceptedFiles.forEach((file) => {
        if (file.size > 1024 * 1024 * 1024) {
          // 1GB limit
          oversizedFiles.push(file.name)
        } else {
          validFiles.push(file)
        }
      })

      if (oversizedFiles.length > 0) {
        setFileUploadError(`Files exceed 1GB limit: ${oversizedFiles.join(", ")}`)
      }

      const newUploadingFiles: UploadingFile[] = validFiles.map((file) => ({
        file,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        progress: 0,
        status: "pending",
        uploadedBytes: 0,
      }))

      setUploadingFiles((prev) => [...prev, ...newUploadingFiles])
    },
    [disabled, setFileUploadError, setUploadingFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize: 1024 * 1024 * 1024, // 1GB
    multiple: true,
    disabled,
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "extracted":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "processing":
        return <Cog className="h-4 w-4 text-orange-500 animate-spin" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "uploading":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case "pending":
        return <div className="h-4 w-4 border-2 border-gray-400 rounded-full bg-gray-100" />
      default:
        return <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
    }
  }

  const getFileIcon = (file: File) => {
    if (isExcelFile(file)) {
      return <FileSpreadsheet className="h-4 w-4 text-green-600" />
    }
    return <FileText className="h-4 w-4 text-blue-600" />
  }

  const getStatusText = (uploadingFile: UploadingFile) => {
    switch (uploadingFile.status) {
      case "extracted":
        return `✅ Specifications extracted (${uploadingFile.extractedData?.totalSpecs || 0} specs)`
      case "processing":
        return "🔄 Extracting specifications..."
      case "completed":
        return isExcelFile(uploadingFile.file) ? "✅ Uploaded - Ready for extraction" : "✅ Upload completed"
      case "uploading":
        return `${uploadingFile.progress}% uploaded`
      case "error":
        return uploadingFile.error || "Upload failed"
      case "pending":
        return "Waiting to upload"
      default:
        return ""
    }
  }

  const pendingFiles = uploadingFiles.filter((f) => f.status === "pending")
  const excelFiles = uploadingFiles.filter((f) => isExcelFile(f.file))
  const extractedFiles = uploadingFiles.filter((f) => f.status === "extracted")
  const processingFiles = uploadingFiles.filter((f) => f.status === "processing")

  return (
    <div className="space-y-4">
      <Label className="block mb-2 text-sm font-medium">Upload Files (Up to 1GB each)</Label>

      {/* Excel Processing Status */}
      {processingFiles.length > 0 && (
        <Alert className="bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-400">
          <Cog className="h-4 w-4 animate-spin" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Processing Excel files...</p>
              <p className="text-sm">Extracting specifications from {processingFiles.length} Excel file(s).</p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Excel Extraction Success */}
      {extractedFiles.length > 0 && (
        <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Excel specifications extracted!</p>
              <p className="text-sm">
                Successfully extracted{" "}
                {extractedFiles.reduce((total, file) => total + (file.extractedData?.totalSpecs || 0), 0)}{" "}
                specifications from {extractedFiles.length} Excel file(s).
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Excel File Notice */}
      {excelFiles.length > 0 && processingFiles.length === 0 && extractedFiles.length === 0 && (
        <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400">
          <FileSpreadsheet className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Excel files detected!</p>
              <p className="text-sm">
                Excel files will be processed immediately after upload to extract specifications automatically.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Drag & Drop Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : disabled
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} disabled={disabled} />
        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        {isDragActive ? (
          <p className="text-blue-600">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-1">
              {disabled ? "File upload disabled during submission" : "Drag & drop files here, or click to select"}
            </p>
            <p className="text-sm text-gray-500">Supports files up to 1GB each</p>
          </div>
        )}
      </div>

      {/* Upload Button */}
      {pendingFiles.length > 0 && !isUploading && !disabled && (
        <div className="flex justify-center">
          <Button onClick={handleUploadFiles} className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700">
            <Upload className="mr-2 h-4 w-4" />
            Upload {pendingFiles.length} File{pendingFiles.length > 1 ? "s" : ""}
          </Button>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              <span className="text-sm font-medium text-blue-700">Uploading files...</span>
            </div>
          </div>
        </div>
      )}

      {/* File List */}
      {uploadingFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2 flex items-center">
            Selected Files ({uploadingFiles.length})
            {excelFiles.length > 0 && (
              <Badge variant="outline" className="ml-2 text-xs">
                <FileSpreadsheet className="mr-1 h-3 w-3" />
                {excelFiles.length} Excel
              </Badge>
            )}
            {extractedFiles.length > 0 && (
              <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                ✅ {extractedFiles.length} Processed
              </Badge>
            )}
          </h4>
          <ul className="space-y-3 max-h-80 overflow-y-auto">
            {uploadingFiles.map((uploadingFile) => (
              <li
                key={uploadingFile.id}
                className={`flex items-center justify-between text-sm p-3 rounded border ${
                  uploadingFile.status === "extracted"
                    ? "bg-green-50 border-green-200"
                    : uploadingFile.status === "completed"
                      ? "bg-blue-50 border-blue-200"
                      : uploadingFile.status === "processing"
                        ? "bg-orange-50 border-orange-200"
                        : uploadingFile.status === "error"
                          ? "bg-red-50 border-red-200"
                          : uploadingFile.status === "uploading"
                            ? "bg-blue-50 border-blue-200"
                            : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-3 flex-grow">
                  {getStatusIcon(uploadingFile.status)}
                  {getFileIcon(uploadingFile.file)}
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <span className="truncate font-medium flex items-center">
                        {uploadingFile.file.name}
                        {isExcelFile(uploadingFile.file) && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Excel
                          </Badge>
                        )}
                        {uploadingFile.status === "extracted" && (
                          <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                            Processed
                          </Badge>
                        )}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {uploadingFile.file.size >= 1024 * 1024 * 1024
                          ? `${(uploadingFile.file.size / (1024 * 1024 * 1024)).toFixed(2)} GB`
                          : `${(uploadingFile.file.size / (1024 * 1024)).toFixed(2)} MB`}
                      </span>
                    </div>

                    {uploadingFile.status === "uploading" && (
                      <div className="mt-1">
                        <Progress value={uploadingFile.progress} className="w-full h-1" />
                      </div>
                    )}

                    <div className="mt-1 text-xs">
                      <span
                        className={
                          uploadingFile.status === "extracted"
                            ? "text-green-600"
                            : uploadingFile.status === "processing"
                              ? "text-orange-600"
                              : uploadingFile.status === "completed"
                                ? "text-blue-600"
                                : uploadingFile.status === "error"
                                  ? "text-red-500"
                                  : "text-gray-500"
                        }
                      >
                        {getStatusText(uploadingFile)}
                      </span>
                    </div>

                    {uploadingFile.extractedData && (
                      <div className="mt-1 text-xs text-green-600">
                        📊 {uploadingFile.extractedData.specifications?.length || 0} specifications,{" "}
                        {uploadingFile.extractedData.assemblyData?.length || 0} assembly items,{" "}
                        {uploadingFile.extractedData.images?.length || 0} images
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {/* Download Button */}
                  {uploadingFile.serverData && uploadingFile.status === "completed" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => downloadFile(uploadingFile.serverData)}
                      className="h-8 w-8 text-blue-500 hover:text-blue-700"
                      title="Download file"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFile(uploadingFile.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                    disabled={disabled || uploadingFile.status === "uploading" || uploadingFile.status === "processing"}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Error Display */}
      {fileUploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{fileUploadError}</AlertDescription>
        </Alert>
      )}

      {/* File Guidelines */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="file-info">
          <AccordionTrigger className="text-sm text-green-800 font-medium">
            Accepted files and upload guidelines
          </AccordionTrigger>
          <AccordionContent>
            <div className="border border-green-200 rounded-md p-4">
              <p className="text-xs text-green-700 mb-2">
                Zip or rar format with BOM/P&P files; XLSX, DOC, CSV, PDF, TXT, CAD/CAM files
              </p>
              <div className="text-xs text-green-700 mb-3">
                <p className="font-medium mb-1">Supported formats:</p>
                <p className="break-words">
                  zip, rar, xls, xlsx, doc, docx, csv, pdf, txt, sch, schdoc, brd, pcb, pcbdoc, dsn, dxf, dwg, step,
                  stp, gbr, ger, gbl, gtl, drl, bom, fab, asm, jpg, jpeg, png, svg, and more CAD/PCB formats
                </p>
              </div>
              <ul className="text-sm text-green-700 list-disc list-inside space-y-1">
                <li>Maximum file size: 1GB per file</li>
                <li>BOM and P&P files must be included within zip or rar archives</li>
                <li>
                  <strong>Excel files (.xls, .xlsx) are automatically processed</strong> immediately after upload to
                  extract specifications
                </li>
                <li>Extracted specifications are automatically populated in the form</li>
                <li>Files are automatically versioned when replaced</li>
                <li>All uploaded files are stored securely on the server</li>
                <li>Files can be downloaded after successful upload</li>
                <li>File replacement maintains version history</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
