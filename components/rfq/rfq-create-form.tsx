

// "use client"
// import { useState, useEffect } from "react"
// import type React from "react"

// import { useRouter } from "next/navigation"
// import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import type { CreateRFQDto } from "@/types/rfq"
// import type { Customer } from "@/types/customer"
// import { CustomerSearchDialog } from "@/components/rfq/customer-search-dialog"
// import { type Specification, fetchServices, fetchSpecifications } from "@/lib/rfq-option"

// // Import modular components
// import { CustomerSelectionStep } from "@/components/rfq/form-sections/customer-selection-step"
// import { FormHeader } from "@/components/rfq/form-sections/form-header"
// import { CustomerInfoCard } from "@/components/rfq/form-sections/customer-info-card"
// import { BasicInfoSection } from "@/components/rfq/form-sections/basic-info-section"
// import { ServicesSection } from "@/components/rfq/form-sections/services-section"
// import { SpecificationsSection } from "@/components/rfq/form-sections/specifications-section"
// import { FileUploadSection } from "@/components/rfq/form-sections/file-upload-section"
// import { SuccessState } from "@/components/rfq/form-sections/success-state"
// import { createRFQ, uploadAndProcessExcelFile } from "@/lib/rfq"

// interface RFQCreateFormProps {
//   onSuccess?: () => void
//   onCancel?: () => void
//   showCard?: boolean
// }

// interface SpecificationValue {
//   specificationId: string
//   value: string
//   unit?: string
// }

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

// interface RFQFile {
//   id: string
//   filename: string
//   originalname: string
//   size: number
//   mimetype: string
// }

// export function RFQCreateForm({ onSuccess, onCancel, showCard = true }: RFQCreateFormProps) {
//   // Step tracking
//   const [step, setStep] = useState<"customer-selection" | "form-completion">("customer-selection")

//   // Basic Information
//   const [title, setTitle] = useState("")
//   const [description, setDescription] = useState("")
//   const [quantity, setQuantity] = useState("")
//   const [status, setStatus] = useState("draft")

//   // Customer Information
//   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
//   const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState(false)

//   // Services
//   const [selectedServices, setSelectedServices] = useState<string[]>([])

//   // Specifications
//   const [specifications, setSpecifications] = useState<Specification[]>([])
//   const [specificationValues, setSpecificationValues] = useState<SpecificationValue[]>([])
//   const [extractedSpecifications, setExtractedSpecifications] = useState<SpecificationValue[]>([])

//   // Files
//   const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
//   const [isUploading, setIsUploading] = useState(false)
//   const [fileUploadError, setFileUploadError] = useState<string | null>(null)

//   // Form state
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [isSubmitted, setIsSubmitted] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState(false)
//   const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

//   // Data from APIs
//   const [services, setServices] = useState<any[]>([])
//   const [isLoadingServices, setIsLoadingServices] = useState(false)
//   const [servicesError, setServicesError] = useState<string | null>(null)
//   const [isLoadingSpecifications, setIsLoadingSpecifications] = useState(false)
//   const [specificationsError, setSpecificationsError] = useState<string | null>(null)

//   const router = useRouter()

//   // Load services and specifications when moving to form completion step
//   useEffect(() => {
//     if (step === "form-completion") {
//       loadServices()
//       loadSpecifications()
//     }
//   }, [step])

//   const loadServices = async () => {
//     setIsLoadingServices(true)
//     setServicesError(null)

//     try {
//       const servicesData = await fetchServices()
//       setServices(servicesData.filter((service) => service.isActive && !service.deletedAt))
//     } catch (err) {
//       console.error("Failed to load services:", err)
//       setServicesError("Failed to load services. Some features may not be available.")
//     } finally {
//       setIsLoadingServices(false)
//     }
//   }

//   const loadSpecifications = async () => {
//     setIsLoadingSpecifications(true)
//     setSpecificationsError(null)

//     try {
//       const specificationsData = await fetchSpecifications()
//       setSpecifications(specificationsData.filter((spec) => spec.isActive && !spec.isDeleted))
//     } catch (err) {
//       console.error("Failed to load specifications:", err)
//       setSpecificationsError("Failed to load specifications. Some features may not be available.")
//     } finally {
//       setIsLoadingSpecifications(false)
//     }
//   }

//   const resetForm = () => {
//     setStep("customer-selection")
//     setTitle("")
//     setDescription("")
//     setQuantity("")
//     setStatus("draft")
//     setSelectedCustomer(null)
//     setSelectedServices([])
//     setSpecificationValues([])
//     setExtractedSpecifications([])
//     setUploadingFiles([])
//     setIsUploading(false)
//     setFileUploadError(null)
//     setFormErrors({})
//     setError(null)
//     setSuccess(false)
//     setIsSubmitted(false)
//     setIsSubmitting(false)
//   }

//   const handleCustomerSelect = (customer: Customer) => {
//     setSelectedCustomer(customer)
//     setStep("form-completion")
//   }

//   const handleChangeCustomer = () => {
//     setIsCustomerSearchOpen(true)
//   }

//   const handleBackToCustomerSelection = () => {
//     setStep("customer-selection")
//   }

//   // Handle specification change
//   const handleSpecificationChange = (specId: string, value: string | number | boolean) => {
//     setSpecificationValues((prev) => {
//       const existingIndex = prev.findIndex((spec) => spec.specificationId === specId)

//       if (!value || value === "" || value === false) {
//         return existingIndex >= 0 ? prev.filter((_, index) => index !== existingIndex) : prev
//       }

//       if (existingIndex >= 0) {
//         return prev.map((spec, index) => (index === existingIndex ? { ...spec, value: String(value) } : spec))
//       }

//       return [...prev, { specificationId: specId, value: String(value) }]
//     })
//   }

//   // Handle service toggle
//   const handleServiceToggle = (serviceId: string) => {
//     setSelectedServices((prev) =>
//       prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
//     )
//   }

//   // Remove file
//   const removeFile = (fileId: string) => {
//     setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId))
//   }

//   // Check if file is Excel
//   const isExcelFile = (file: File): boolean => {
//     const excelTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
//     const excelExtensions = [".xls", ".xlsx"]
//     const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."))

//     return excelTypes.includes(file.type) || excelExtensions.includes(fileExtension)
//   }

//   // Upload single file with immediate Excel processing for Excel files
//   const uploadSingleFile = async (uploadingFile: UploadingFile): Promise<RFQFile> => {
//     const { file, id } = uploadingFile

//     return new Promise((resolve, reject) => {
//       console.log(`🚀 Starting upload for: ${file.name}`)

//       // Update status to uploading
//       setUploadingFiles((prev) =>
//         prev.map((f) => (f.id === id ? { ...f, status: "uploading", progress: 0, uploadedBytes: 0 } : f)),
//       )

//       // Check if it's an Excel file
//       if (isExcelFile(file)) {
//         // For Excel files, we'll upload and then immediately process
//         uploadExcelFileWithProcessing(uploadingFile).then(resolve).catch(reject)
//       } else {
//         // For regular files, use normal upload
//         uploadRegularFile(uploadingFile).then(resolve).catch(reject)
//       }
//     })
//   }

//   // Upload regular (non-Excel) files
//   const uploadRegularFile = async (uploadingFile: UploadingFile): Promise<RFQFile> => {
//     const { file, id } = uploadingFile

//     return new Promise((resolve, reject) => {
//       const formData = new FormData()
//       formData.append("files", file)

//       const xhr = new XMLHttpRequest()

//       // Track upload progress
//       xhr.upload.addEventListener("progress", (event) => {
//         if (event.lengthComputable) {
//           const progress = Math.round((event.loaded / event.total) * 100)
//           setUploadingFiles((prev) =>
//             prev.map((f) => (f.id === id ? { ...f, progress, uploadedBytes: event.loaded } : f)),
//           )
//         }
//       })

//       // Handle successful upload
//       xhr.addEventListener("load", () => {
//         if (xhr.status >= 200 && xhr.status < 300) {
//           try {
//             const response = JSON.parse(xhr.responseText)
//             const fileData = Array.isArray(response) ? response[0] : response

//             const serverData = {
//               id: fileData?.id || id,
//               filename: fileData?.filename || file.name,
//               originalname: fileData?.originalname || file.name,
//               size: fileData?.size || file.size,
//               mimetype: fileData?.mimetype || file.type,
//             }

//             setUploadingFiles((prev) =>
//               prev.map((f) => (f.id === id ? { ...f, status: "completed", progress: 100, serverData } : f)),
//             )

//             console.log(`✅ Upload completed for: ${file.name}`)
//             resolve(fileData)
//           } catch (error) {
//             const errorMessage = "Invalid server response"
//             setUploadingFiles((prev) =>
//               prev.map((f) => (f.id === id ? { ...f, status: "error", error: errorMessage } : f)),
//             )
//             reject(new Error(errorMessage))
//           }
//         } else {
//           let errorMessage = `Upload failed: ${xhr.status}`
//           if (xhr.status === 413) errorMessage = "File too large (max 1GB)"
//           else if (xhr.status === 400) errorMessage = "Invalid file type"

//           setUploadingFiles((prev) =>
//             prev.map((f) => (f.id === id ? { ...f, status: "error", error: errorMessage } : f)),
//           )
//           reject(new Error(errorMessage))
//         }
//       })

//       xhr.addEventListener("error", () => {
//         const errorMessage = "Network error occurred"
//         setUploadingFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "error", error: errorMessage } : f)))
//         reject(new Error(errorMessage))
//       })

//       xhr.timeout = 5 * 60 * 1000
//       xhr.addEventListener("timeout", () => {
//         const errorMessage = "Upload timeout"
//         setUploadingFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "error", error: errorMessage } : f)))
//         reject(new Error(errorMessage))
//       })

//       xhr.open("POST", "http://irush-server.rushpcb.com:5000/upload")
//       xhr.send(formData)
//     })
//   }

//   // Upload Excel files and process them immediately (requires RFQ ID)
//   const uploadExcelFileWithProcessing = async (uploadingFile: UploadingFile): Promise<RFQFile> => {
//     const { file, id } = uploadingFile

//     try {
//       // First, upload the file normally
//       setUploadingFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "uploading", progress: 50 } : f)))

//       const formData = new FormData()
//       formData.append("files", file)

//       const uploadResponse = await fetch("http://irush-server.rushpcb.com:5000/upload", {
//         method: "POST",
//         body: formData,
//       })

//       if (!uploadResponse.ok) {
//         throw new Error(`Upload failed: ${uploadResponse.status}`)
//       }

//       const uploadResult = await uploadResponse.json()
//       const fileData = Array.isArray(uploadResult) ? uploadResult[0] : uploadResult

//       const serverData = {
//         id: fileData?.id || id,
//         filename: fileData?.filename || file.name,
//         originalname: fileData?.originalname || file.name,
//         size: fileData?.size || file.size,
//         mimetype: fileData?.mimetype || file.type,
//       }

//       // Mark as uploaded but not yet processed
//       setUploadingFiles((prev) =>
//         prev.map((f) => (f.id === id ? { ...f, status: "completed", progress: 100, serverData } : f)),
//       )

//       console.log(`✅ Excel file uploaded: ${file.name} - Ready for processing after RFQ creation`)

//       return fileData
//     } catch (error) {
//       console.error(`❌ Excel upload failed for ${file.name}:`, error)

//       let errorMessage = "Excel upload failed"
//       if (error instanceof Error) {
//         errorMessage = error.message
//       }

//       setUploadingFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "error", error: errorMessage } : f)))
//       throw error
//     }
//   }

//   // Process Excel files immediately after RFQ creation using your backend endpoint
//   const processExcelFilesAfterRfqCreation = async (rfqId: string) => {
//     const excelFiles = uploadingFiles.filter((f) => f.status === "completed" && isExcelFile(f.file))

//     if (excelFiles.length === 0) {
//       return
//     }

//     console.log(`🔄 Processing ${excelFiles.length} Excel files for RFQ: ${rfqId}`)

//     for (const excelFile of excelFiles) {
//       try {
//         console.log(`📊 Processing Excel file: ${excelFile.file.name} for RFQ: ${rfqId}`)

//         // Update status to processing
//         setUploadingFiles((prev) => prev.map((f) => (f.id === excelFile.id ? { ...f, status: "processing" } : f)))

//         // Process Excel file using your RFQ controller's upload-excel endpoint
//         // This will call your processExcelAndSave method
//         const extractedData = await uploadAndProcessExcelFile(rfqId, excelFile.file)

//         console.log(`✅ Excel processing completed for: ${excelFile.file.name}`, extractedData)

//         // Update file with extracted data
//         setUploadingFiles((prev) =>
//           prev.map((f) =>
//             f.id === excelFile.id
//               ? {
//                   ...f,
//                   status: "extracted",
//                   extractedData: {
//                     specifications: extractedData.extractedSpecs || [],
//                     assemblyData: extractedData.extractedAssembly || [],
//                     images: extractedData.extractedImages || [],
//                     totalSpecs: extractedData.extractedSpecs?.length || 0,
//                   },
//                 }
//               : f,
//           ),
//         )

//         // Auto-populate extracted specifications into the form
//         if (extractedData.extractedSpecs && extractedData.extractedSpecs.length > 0) {
//           const newExtractedSpecs: SpecificationValue[] = extractedData.extractedSpecs
//             .map((spec: any) => {
//               // Find matching specification in the available specifications
//               const matchingSpec = specifications.find(
//                 (s) =>
//                   s.name.toLowerCase() === spec.key?.toLowerCase() ||
//                   s.xlName?.toLowerCase() === spec.key?.toLowerCase(),
//               )

//               if (matchingSpec) {
//                 return {
//                   specificationId: matchingSpec.id,
//                   value: String(spec.value || ""),
//                   unit: spec.unit,
//                 }
//               }
//               return null
//             })
//             .filter(Boolean) as SpecificationValue[]

//           // Add extracted specifications to the form
//           setExtractedSpecifications((prev) => [...prev, ...newExtractedSpecs])

//           // Merge with existing specification values
//           setSpecificationValues((prev) => {
//             const merged = [...prev]
//             newExtractedSpecs.forEach((newSpec) => {
//               const existingIndex = merged.findIndex((spec) => spec.specificationId === newSpec.specificationId)
//               if (existingIndex >= 0) {
//                 // Update existing specification
//                 merged[existingIndex] = newSpec
//               } else {
//                 // Add new specification
//                 merged.push(newSpec)
//               }
//             })
//             return merged
//           })

//           console.log(`📋 Auto-populated ${newExtractedSpecs.length} specifications from Excel`)
//         }
//       } catch (error) {
//         console.error(`❌ Failed to process Excel file ${excelFile.file.name}:`, error)

//         // Update status to error
//         setUploadingFiles((prev) =>
//           prev.map((f) =>
//             f.id === excelFile.id
//               ? {
//                   ...f,
//                   status: "error",
//                   error: `Excel processing failed: ${error instanceof Error ? error.message : "Unknown error"}`,
//                 }
//               : f,
//           ),
//         )
//       }
//     }
//   }

//   // Handle manual file upload
//   const handleUploadFiles = async () => {
//     const pendingFiles = uploadingFiles.filter((f) => f.status === "pending")

//     if (pendingFiles.length === 0) {
//       setFileUploadError("No files to upload")
//       return
//     }

//     setIsUploading(true)
//     setFileUploadError(null)

//     try {
//       console.log(`🔄 Starting upload for ${pendingFiles.length} files`)

//       // Upload files sequentially to avoid overwhelming the server
//       for (const uploadingFile of pendingFiles) {
//         await uploadSingleFile(uploadingFile)
//       }

//       console.log("✅ All files uploaded successfully")
//     } catch (error) {
//       console.error("❌ Upload failed:", error)
//       setFileUploadError(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   // Form validation
//   const validateForm = (): boolean => {
//     let valid = true
//     const newFormErrors: { [key: string]: string } = {}

//     if (!selectedCustomer) {
//       newFormErrors.customer = "Customer selection is required."
//       valid = false
//     }
//     if (!title.trim()) {
//       newFormErrors.title = "Title is required."
//       valid = false
//     }

//     setFormErrors(newFormErrors)
//     return valid
//   }

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     console.log("🚀 Form submission started")

//     setError(null)
//     setFileUploadError(null)

//     // Validate form
//     if (!validateForm()) {
//       console.log("❌ Form validation failed")
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       // Upload any pending files first
//       const pendingFiles = uploadingFiles.filter((f) => f.status === "pending")

//       if (pendingFiles.length > 0) {
//         console.log(`🔄 Uploading ${pendingFiles.length} pending files before submission`)
//         setIsUploading(true)

//         try {
//           for (const uploadingFile of pendingFiles) {
//             await uploadSingleFile(uploadingFile)
//           }
//           console.log("✅ All pending files uploaded")
//         } catch (uploadError) {
//           console.error("❌ File upload failed:", uploadError)
//           setFileUploadError(
//             `File upload failed: ${uploadError instanceof Error ? uploadError.message : "Unknown error"}`,
//           )
//           return
//         } finally {
//           setIsUploading(false)
//         }
//       }

//       // Get uploaded file IDs (excluding Excel files that will be processed separately)
//       const completedFiles = uploadingFiles.filter((f) => f.status === "completed" && f.serverData)
//       const fileIds = completedFiles.map((f) => ({ id: f.serverData!.id }))

//       // Combine manual and extracted specifications
//       const allSpecifications = [...specificationValues, ...extractedSpecifications]
//       const uniqueSpecifications = allSpecifications.reduce((acc, spec) => {
//         const existingIndex = acc.findIndex((s) => s.specificationId === spec.specificationId)
//         if (existingIndex >= 0) {
//           // Keep the latest value (manual input takes precedence over extracted)
//           acc[existingIndex] = spec
//         } else {
//           acc.push(spec)
//         }
//         return acc
//       }, [] as SpecificationValue[])

//       console.log("📝 Creating RFQ with data:", {
//         title,
//         description,
//         status,
//         quantity,
//         customerId: selectedCustomer?.id,
//         servicesCount: selectedServices.length,
//         specificationsCount: uniqueSpecifications.length,
//         filesCount: fileIds.length,
//       })

//       const rfqData: CreateRFQDto = {
//         title: title.trim(),
//         description: description.trim(),
//         status,
//         quantity: quantity.trim(),
//         customerId: selectedCustomer!.id,
//         ...(selectedServices.length > 0 && { services: selectedServices }),
//         ...(uniqueSpecifications.length > 0 && { rfqSpecifications: uniqueSpecifications }),
//         ...(fileIds.length > 0 && { files: fileIds }),
//       }

//       console.log("📤 Submitting RFQ data:", rfqData)
//       const createdRFQ = await createRFQ(rfqData)
//       console.log("✅ RFQ created successfully:", createdRFQ)

//       // Process Excel files immediately after RFQ creation
//       await processExcelFilesAfterRfqCreation(createdRFQ.id)

//       setSuccess(true)
//       setIsSubmitted(true)

//       if (onSuccess) {
//         setTimeout(() => {
//           onSuccess()
//         }, 1500)
//       }
//     } catch (err) {
//       console.error("❌ Error creating RFQ:", err)

//       if (err instanceof Error) {
//         if (err.message.includes("Customer not found")) {
//           setError("The selected customer is no longer available. Please select a different customer.")
//           setSelectedCustomer(null)
//           setStep("customer-selection")
//         } else if (err.message.includes("Validation failed")) {
//           setError(err.message)
//         } else {
//           setError(err.message || "Failed to create RFQ. Please try again.")
//         }
//       } else {
//         setError("Failed to create RFQ. Please try again.")
//       }
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   // Success state
//   if (isSubmitted) {
//     return (
//       <SuccessState
//         onReset={resetForm}
//         onViewRFQs={() => router.push("/dashboard/rfq")}
//         extractedSpecifications={extractedSpecifications}
//         uploadingFiles={uploadingFiles}
//       />
//     )
//   }

//   // Customer Selection Step
//   if (step === "customer-selection") {
//     const content = (
//       <CustomerSelectionStep
//         isCustomerSearchOpen={isCustomerSearchOpen}
//         setIsCustomerSearchOpen={setIsCustomerSearchOpen}
//         onCustomerSelect={handleCustomerSelect}
//         error={error}
//       />
//     )

//     if (showCard) {
//       return (
//         <Card>
//           <CardContent className="mt-5">{content}</CardContent>
//         </Card>
//       )
//     }

//     return <div className="space-y-4">{content}</div>
//   }

//   // Form Completion Step
//   const isLoading = isLoadingServices || isLoadingSpecifications
//   const isFormDisabled = isSubmitting || success
//   const hasExtractedSpecs = extractedSpecifications.length > 0

//   const content = (
//     <div className="space-y-6">
//       {/* Header */}
//       <FormHeader
//         customer={selectedCustomer}
//         onBackToCustomerSelection={handleBackToCustomerSelection}
//         isLoading={isLoading}
//       />
//       {/* Loading state */}
//       {isLoading && <div />} {/* Empty div to prevent content flash */}
//       {/* Form content */}
//       {!isLoading && (
//         <>
//           {/* Customer Info Card */}
//           <CustomerInfoCard customer={selectedCustomer!} onChangeCustomer={handleChangeCustomer} />

//           {/* Extracted Specifications Alert */}
//           {hasExtractedSpecs && (
//             <Alert className="bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
//               <CheckCircle className="h-4 w-4" />
//               <AlertDescription>
//                 ✅ Automatically extracted {extractedSpecifications.length} specifications from Excel files. You can
//                 review and modify them below.
//               </AlertDescription>
//             </Alert>
//           )}

//           {/* Error Display */}
//           {error && (
//             <Alert variant="destructive">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           {/* Success Alert */}
//           {success && (
//             <Alert className="bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
//               <CheckCircle className="h-4 w-4" />
//               <AlertDescription>RFQ created successfully!</AlertDescription>
//             </Alert>
//           )}

//           {/* Main Form */}
//           <Card>
//             <CardContent className="p-6">
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Basic Information */}
//                 <BasicInfoSection
//                   title={title}
//                   setTitle={setTitle}
//                   quantity={quantity}
//                   setQuantity={setQuantity}
//                   status={status}
//                   setStatus={setStatus}
//                   description={description}
//                   setDescription={setDescription}
//                   formErrors={formErrors}
//                   disabled={isFormDisabled}
//                 />

//                 {/* Services */}
//                 <ServicesSection
//                   services={services}
//                   selectedServices={selectedServices}
//                   onServiceToggle={handleServiceToggle}
//                   disabled={isFormDisabled}
//                 />

//                 {/* Specifications */}
//                 <SpecificationsSection
//                   specifications={specifications}
//                   specificationValues={specificationValues}
//                   onSpecificationChange={handleSpecificationChange}
//                   disabled={isFormDisabled}
//                   extractedCount={extractedSpecifications.length}
//                 />

//                 {/* File Upload */}
//                 <FileUploadSection
//                   uploadingFiles={uploadingFiles}
//                   setUploadingFiles={setUploadingFiles}
//                   isUploading={isUploading}
//                   fileUploadError={fileUploadError}
//                   setFileUploadError={setFileUploadError}
//                   onUploadFiles={handleUploadFiles}
//                   onRemoveFile={removeFile}
//                   disabled={isFormDisabled}
//                 />

//                 {/* Submit Button */}
//                 <div className="flex justify-end space-x-2 pt-4">
//                   {onCancel && (
//                     <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
//                       Cancel
//                     </Button>
//                   )}
//                   <Button type="submit" disabled={isSubmitting || success}>
//                     {isSubmitting ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Creating RFQ...
//                       </>
//                     ) : (
//                       "Create RFQ"
//                     )}
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>

//           <CustomerSearchDialog
//             open={isCustomerSearchOpen}
//             onOpenChange={setIsCustomerSearchOpen}
//             onSelectCustomer={handleCustomerSelect}
//           />
//         </>
//       )}
//     </div>
//   )

//   if (showCard) {
//     return (
//       <Card>
//         <CardContent className="mt-5">{content}</CardContent>
//       </Card>
//     )
//   }

//   return <div className="space-y-4">{content}</div>
// }
























// "use client"
// import { useState, useEffect } from "react"
// import type React from "react"

// import { useRouter } from "next/navigation"
// import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import type { CreateRFQDto } from "@/types/rfq"
// import type { Customer } from "@/types/customer"
// import { CustomerSearchDialog } from "@/components/rfq/customer-search-dialog"
// import { type Specification, fetchServices, fetchSpecifications } from "@/lib/rfq-option"

// // Import modular components
// import { CustomerSelectionStep } from "@/components/rfq/form-sections/customer-selection-step"
// import { FormHeader } from "@/components/rfq/form-sections/form-header"
// import { CustomerInfoCard } from "@/components/rfq/form-sections/customer-info-card"
// import { BasicInfoSection } from "@/components/rfq/form-sections/basic-info-section"
// import { ServicesSection } from "@/components/rfq/form-sections/services-section"
// import { SpecificationsSection } from "@/components/rfq/form-sections/specifications-section"
// import { FileUploadSection } from "@/components/rfq/form-sections/file-upload-section"
// import { SuccessState } from "@/components/rfq/form-sections/success-state"
// import { createRFQ } from "@/lib/rfq"

// const API_BASE_URL = "http://irush-server.rushpcb.com:5000"

// interface RFQCreateFormProps {
//   onSuccess?: () => void
//   onCancel?: () => void
//   showCard?: boolean
// }

// interface SpecificationValue {
//   specificationId: string
//   value: string
//   unit?: string
// }

// interface UploadingFile {
//   file: File
//   id: string
//   progress: number
//   status: "pending" | "uploading" | "completed" | "error" | "processing"
//   error?: string
//   uploadedBytes: number
//   serverData?: {
//     id: string
//     filename: string
//     originalname: string
//     size: number
//     mimetype: string
//     extractedSpecs?: any[]
//     extractedAssembly?: any[]
//     extractedImages?: any[]
//   }
// }

// interface RFQFile {
//   id: string
//   filename: string
//   originalname: string
//   size: number
//   mimetype: string
//   extractedSpecs?: any[]
//   extractedAssembly?: any[]
//   extractedImages?: any[]
// }

// export function RFQCreateForm({ onSuccess, onCancel, showCard = true }: RFQCreateFormProps) {
//   // Step tracking
//   const [step, setStep] = useState<"customer-selection" | "form-completion">("customer-selection")

//   // Basic Information
//   const [title, setTitle] = useState("")
//   const [description, setDescription] = useState("")
//   const [quantity, setQuantity] = useState("")
//   const [status, setStatus] = useState("draft")

//   // Customer Information
//   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
//   const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState(false)

//   // Services
//   const [selectedServices, setSelectedServices] = useState<string[]>([])

//   // Specifications
//   const [specifications, setSpecifications] = useState<Specification[]>([])
//   const [specificationValues, setSpecificationValues] = useState<SpecificationValue[]>([])
//   const [extractedSpecifications, setExtractedSpecifications] = useState<SpecificationValue[]>([])

//   // Files
//   const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
//   const [isUploading, setIsUploading] = useState(false)
//   const [fileUploadError, setFileUploadError] = useState<string | null>(null)

//   // Form state
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [isSubmitted, setIsSubmitted] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState(false)
//   const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

//   // Data from APIs
//   const [services, setServices] = useState<any[]>([])
//   const [isLoadingServices, setIsLoadingServices] = useState(false)
//   const [servicesError, setServicesError] = useState<string | null>(null)
//   const [isLoadingSpecifications, setIsLoadingSpecifications] = useState(false)
//   const [specificationsError, setSpecificationsError] = useState<string | null>(null)

//   const router = useRouter()

//   // Load services and specifications when moving to form completion step
//   useEffect(() => {
//     if (step === "form-completion") {
//       loadServices()
//       loadSpecifications()
//     }
//   }, [step])

//   const loadServices = async () => {
//     setIsLoadingServices(true)
//     setServicesError(null)

//     try {
//       const servicesData = await fetchServices()
//       setServices(servicesData.filter((service) => service.isActive && !service.deletedAt))
//     } catch (err) {
//       console.error("Failed to load services:", err)
//       setServicesError("Failed to load services. Some features may not be available.")
//     } finally {
//       setIsLoadingServices(false)
//     }
//   }

//   const loadSpecifications = async () => {
//     setIsLoadingSpecifications(true)
//     setSpecificationsError(null)

//     try {
//       const specificationsData = await fetchSpecifications()
//       setSpecifications(specificationsData.filter((spec) => spec.isActive && !spec.isDeleted))
//     } catch (err) {
//       console.error("Failed to load specifications:", err)
//       setSpecificationsError("Failed to load specifications. Some features may not be available.")
//     } finally {
//       setIsLoadingSpecifications(false)
//     }
//   }

//   const resetForm = () => {
//     setStep("customer-selection")
//     setTitle("")
//     setDescription("")
//     setQuantity("")
//     setStatus("draft")
//     setSelectedCustomer(null)
//     setSelectedServices([])
//     setSpecificationValues([])
//     setExtractedSpecifications([])
//     setUploadingFiles([])
//     setIsUploading(false)
//     setFileUploadError(null)
//     setFormErrors({})
//     setError(null)
//     setSuccess(false)
//     setIsSubmitted(false)
//     setIsSubmitting(false)
//   }

//   const handleCustomerSelect = (customer: Customer) => {
//     setSelectedCustomer(customer)
//     setStep("form-completion")
//   }

//   const handleChangeCustomer = () => {
//     setIsCustomerSearchOpen(true)
//   }

//   const handleBackToCustomerSelection = () => {
//     setStep("customer-selection")
//   }

//   // Handle specification change
//   const handleSpecificationChange = (specId: string, value: string | number | boolean) => {
//     setSpecificationValues((prev) => {
//       const existingIndex = prev.findIndex((spec) => spec.specificationId === specId)

//       if (!value || value === "" || value === false) {
//         return existingIndex >= 0 ? prev.filter((_, index) => index !== existingIndex) : prev
//       }

//       if (existingIndex >= 0) {
//         return prev.map((spec, index) => (index === existingIndex ? { ...spec, value: String(value) } : spec))
//       }

//       return [...prev, { specificationId: specId, value: String(value) }]
//     })
//   }

//   // Handle service toggle
//   const handleServiceToggle = (serviceId: string) => {
//     setSelectedServices((prev) =>
//       prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
//     )
//   }

//   // Remove file
//   const removeFile = (fileId: string) => {
//     setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId))
//   }

//   // Check if file is Excel
//   const isExcelFile = (file: File): boolean => {
//     const excelTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
//     const excelExtensions = [".xls", ".xlsx"]
//     const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."))

//     return excelTypes.includes(file.type) || excelExtensions.includes(fileExtension)
//   }

//   // Update the uploadSingleFile function to match the UploadService implementation
//   const uploadSingleFile = async (uploadingFile: UploadingFile): Promise<RFQFile> => {
//     const { file, id } = uploadingFile

//     return new Promise((resolve, reject) => {
//       const formData = new FormData()
//       formData.append("files", file)

//       // Add metadata to help backend process the file
//       // Note: For new RFQs, we don't have an RFQ ID yet, so we'll associate files after RFQ creation
//       const metadata = {
//         modelType: "RFQ",
//         isExcel: isExcelFile(file),
//       }
//       formData.append("metadata", JSON.stringify(metadata))

//       const xhr = new XMLHttpRequest()

//       console.log(`🚀 Starting upload for: ${file.name}`)

//       // Update status to uploading
//       setUploadingFiles((prev) =>
//         prev.map((f) => (f.id === id ? { ...f, status: "uploading", progress: 0, uploadedBytes: 0 } : f)),
//       )

//       // Track upload progress
//       xhr.upload.addEventListener("progress", (event) => {
//         if (event.lengthComputable) {
//           const progress = Math.round((event.loaded / event.total) * 100)

//           setUploadingFiles((prev) =>
//             prev.map((f) => (f.id === id ? { ...f, progress, uploadedBytes: event.loaded } : f)),
//           )
//         }
//       })

//       // Handle successful upload
//       xhr.addEventListener("load", async () => {
//         if (xhr.status >= 200 && xhr.status < 300) {
//           try {
//             const response = JSON.parse(xhr.responseText)

//             // Handle your controller's response format (array of files)
//             let fileData
//             if (Array.isArray(response)) {
//               fileData = response[0] // Get first file from array
//             } else {
//               fileData = response
//             }

//             const serverData = {
//               id: fileData?.id || id,
//               filename: fileData?.filename || file.name,
//               originalname: fileData?.originalname || file.name,
//               size: fileData?.size || file.size,
//               mimetype: fileData?.mimetype || file.type,
//               path: fileData?.path,
//               modelType: fileData?.modelType || "RFQ",
//             }

//             setUploadingFiles((prev) =>
//               prev.map((f) => (f.id === id ? { ...f, status: "completed", progress: 100, serverData } : f)),
//             )

//             console.log(`✅ Upload completed for: ${file.name}`)

//             // If it's an Excel file, we'll process it after RFQ creation
//             if (isExcelFile(file)) {
//               console.log(`📊 Excel file detected: ${file.name} - Will be processed after RFQ creation`)
//             }

//             resolve(fileData)
//           } catch (error) {
//             console.error(`❌ Error parsing response for ${file.name}:`, error)
//             setUploadingFiles((prev) =>
//               prev.map((f) => (f.id === id ? { ...f, status: "error", error: "Invalid server response" } : f)),
//             )
//             reject(new Error("Invalid server response"))
//           }
//         } else {
//           let errorMessage = `Upload failed: ${xhr.status}`

//           if (xhr.status === 413) {
//             errorMessage = "File too large (max 1GB)"
//           } else if (xhr.status === 400) {
//             errorMessage = "Invalid file type"
//           }

//           setUploadingFiles((prev) =>
//             prev.map((f) => (f.id === id ? { ...f, status: "error", error: errorMessage } : f)),
//           )
//           reject(new Error(errorMessage))
//         }
//       })

//       // Handle upload errors
//       xhr.addEventListener("error", () => {
//         const errorMessage = "Network error occurred"
//         setUploadingFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "error", error: errorMessage } : f)))
//         reject(new Error(errorMessage))
//       })

//       // Start upload to your upload controller
//       xhr.open("POST", `${API_BASE_URL}/upload`)
//       xhr.send(formData)
//     })
//   }

//   // Handle manual file upload
//   const handleUploadFiles = async () => {
//     const pendingFiles = uploadingFiles.filter((f) => f.status === "pending")

//     if (pendingFiles.length === 0) {
//       setFileUploadError("No files to upload")
//       return
//     }

//     setIsUploading(true)
//     setFileUploadError(null)

//     try {
//       console.log(`🔄 Starting upload for ${pendingFiles.length} files`)

//       // Upload files sequentially to avoid overwhelming the server
//       for (const uploadingFile of pendingFiles) {
//         await uploadSingleFile(uploadingFile)
//       }

//       console.log("✅ All files uploaded successfully")
//     } catch (error) {
//       console.error("❌ Upload failed:", error)
//       setFileUploadError(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   // Form validation
//   const validateForm = (): boolean => {
//     let valid = true
//     const newFormErrors: { [key: string]: string } = {}

//     if (!selectedCustomer) {
//       newFormErrors.customer = "Customer selection is required."
//       valid = false
//     }
//     if (!title.trim()) {
//       newFormErrors.title = "Title is required."
//       valid = false
//     }

//     setFormErrors(newFormErrors)
//     return valid
//   }

//   // Update the handleSubmit function to update file associations after RFQ creation
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     console.log("🚀 Form submission started")

//     setError(null)
//     setFileUploadError(null)

//     // Validate form
//     if (!validateForm()) {
//       console.log("❌ Form validation failed")
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       // Upload any pending files first
//       const pendingFiles = uploadingFiles.filter((f) => f.status === "pending")

//       if (pendingFiles.length > 0) {
//         console.log(`🔄 Uploading ${pendingFiles.length} pending files before submission`)
//         setIsUploading(true)

//         try {
//           for (const uploadingFile of pendingFiles) {
//             await uploadSingleFile(uploadingFile)
//           }
//           console.log("✅ All pending files uploaded")
//         } catch (uploadError) {
//           console.error("❌ File upload failed:", uploadError)
//           setFileUploadError(
//             `File upload failed: ${uploadError instanceof Error ? uploadError.message : "Unknown error"}`,
//           )
//           return
//         } finally {
//           setIsUploading(false)
//         }
//       }

//       // Get uploaded file IDs
//       const completedFiles = uploadingFiles.filter((f) => f.status === "completed" && f.serverData)
//       const fileIds = completedFiles.map((f) => ({ id: f.serverData!.id }))

//       // Combine manual and extracted specifications
//       const allSpecifications = [...specificationValues, ...extractedSpecifications]
//       const uniqueSpecifications = allSpecifications.reduce((acc, spec) => {
//         const existingIndex = acc.findIndex((s) => s.specificationId === spec.specificationId)
//         if (existingIndex >= 0) {
//           // Keep the latest value (manual input takes precedence over extracted)
//           acc[existingIndex] = spec
//         } else {
//           acc.push(spec)
//         }
//         return acc
//       }, [] as SpecificationValue[])

//       console.log("📝 Creating RFQ with data:", {
//         title,
//         description,
//         status,
//         quantity,
//         customerId: selectedCustomer?.id,
//         servicesCount: selectedServices.length,
//         specificationsCount: uniqueSpecifications.length,
//         filesCount: fileIds.length,
//       })

//       const rfqData: CreateRFQDto = {
//         title: title.trim(),
//         description: description.trim(),
//         status,
//         quantity: quantity.trim(),
//         customerId: selectedCustomer!.id,
//         ...(selectedServices.length > 0 && { services: selectedServices }),
//         ...(uniqueSpecifications.length > 0 && { rfqSpecifications: uniqueSpecifications }),
//         ...(fileIds.length > 0 && { files: fileIds }),
//       }

//       console.log("📤 Submitting RFQ data:", rfqData)
//       const createdRFQ = await createRFQ(rfqData)
//       console.log("✅ RFQ created successfully:", createdRFQ)

//       // Update file associations with the new RFQ ID if needed
//       if (completedFiles.length > 0 && createdRFQ.id) {
//         console.log(`🔄 Updating file associations for RFQ ID: ${createdRFQ.id}`)

//         // For each file, update the filename to include the RFQ ID
//         for (const file of completedFiles) {
//           try {
//             await fetch(`${API_BASE_URL}/upload/update-filename/${file.serverData!.id}/${createdRFQ.id}`, {
//               method: "PUT",
//             })
//           } catch (error) {
//             console.warn(`⚠️ Failed to update filename for file ${file.serverData!.id}:`, error)
//             // Non-critical error, continue with other files
//           }
//         }
//       }

//       setSuccess(true)
//       setIsSubmitted(true)

//       if (onSuccess) {
//         setTimeout(() => {
//           onSuccess()
//         }, 1500)
//       }
//     } catch (err) {
//       console.error("❌ Error creating RFQ:", err)

//       if (err instanceof Error) {
//         if (err.message.includes("Customer not found")) {
//           setError("The selected customer is no longer available. Please select a different customer.")
//           setSelectedCustomer(null)
//           setStep("customer-selection")
//         } else if (err.message.includes("Validation failed")) {
//           setError(err.message)
//         } else {
//           setError(err.message || "Failed to create RFQ. Please try again.")
//         }
//       } else {
//         setError("Failed to create RFQ. Please try again.")
//       }
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   // Success state
//   if (isSubmitted) {
//     return (
//       <SuccessState
//         onReset={resetForm}
//         onViewRFQs={() => router.push("/dashboard/rfq")}
//         extractedSpecifications={extractedSpecifications}
//         uploadingFiles={uploadingFiles}
//       />
//     )
//   }

//   // Customer Selection Step
//   if (step === "customer-selection") {
//     const content = (
//       <CustomerSelectionStep
//         isCustomerSearchOpen={isCustomerSearchOpen}
//         setIsCustomerSearchOpen={setIsCustomerSearchOpen}
//         onCustomerSelect={handleCustomerSelect}
//         error={error}
//       />
//     )

//     if (showCard) {
//       return (
//         <Card>
//           <CardContent className="mt-5">{content}</CardContent>
//         </Card>
//       )
//     }

//     return <div className="space-y-4">{content}</div>
//   }

//   // Form Completion Step
//   const isLoading = isLoadingServices || isLoadingSpecifications
//   const isFormDisabled = isSubmitting || success
//   const hasExtractedSpecs = extractedSpecifications.length > 0

//   const content = (
//     <div className="space-y-6">
//       {/* Header */}
//       <FormHeader
//         customer={selectedCustomer}
//         onBackToCustomerSelection={handleBackToCustomerSelection}
//         isLoading={isLoading}
//       />
//       {/* Loading state */}
//       {isLoading && <div />} {/* Empty div to prevent content flash */}
//       {/* Form content */}
//       {!isLoading && (
//         <>
//           {/* Customer Info Card */}
//           <CustomerInfoCard customer={selectedCustomer!} onChangeCustomer={handleChangeCustomer} />

//           {/* Extracted Specifications Alert */}
//           {hasExtractedSpecs && (
//             <Alert className="bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
//               <CheckCircle className="h-4 w-4" />
//               <AlertDescription>
//                 ✅ Automatically extracted {extractedSpecifications.length} specifications from Excel files. You can
//                 review and modify them below.
//               </AlertDescription>
//             </Alert>
//           )}

//           {/* Error Display */}
//           {error && (
//             <Alert variant="destructive">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           {/* Success Alert */}
//           {success && (
//             <Alert className="bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
//               <CheckCircle className="h-4 w-4" />
//               <AlertDescription>RFQ created successfully!</AlertDescription>
//             </Alert>
//           )}

//           {/* Main Form */}
//           <Card>
//             <CardContent className="p-6">
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Basic Information */}
//                 <BasicInfoSection
//                   title={title}
//                   setTitle={setTitle}
//                   quantity={quantity}
//                   setQuantity={setQuantity}
//                   status={status}
//                   setStatus={setStatus}
//                   description={description}
//                   setDescription={setDescription}
//                   formErrors={formErrors}
//                   disabled={isFormDisabled}
//                 />

//                 {/* Services */}
//                 <ServicesSection
//                   services={services}
//                   selectedServices={selectedServices}
//                   onServiceToggle={handleServiceToggle}
//                   disabled={isFormDisabled}
//                 />

//                 {/* Specifications */}
//                 <SpecificationsSection
//                   specifications={specifications}
//                   specificationValues={specificationValues}
//                   onSpecificationChange={handleSpecificationChange}
//                   disabled={isFormDisabled}
//                   extractedCount={extractedSpecifications.length}
//                 />

//                 {/* File Upload */}
//                 <FileUploadSection
//                   uploadingFiles={uploadingFiles}
//                   setUploadingFiles={setUploadingFiles}
//                   isUploading={isUploading}
//                   fileUploadError={fileUploadError}
//                   setFileUploadError={setFileUploadError}
//                   onUploadFiles={handleUploadFiles}
//                   onRemoveFile={removeFile}
//                   disabled={isFormDisabled}
//                 />

//                 {/* Submit Button */}
//                 <div className="flex justify-end space-x-2 pt-4">
//                   {onCancel && (
//                     <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
//                       Cancel
//                     </Button>
//                   )}
//                   <Button type="submit" disabled={isSubmitting || success}>
//                     {isSubmitting ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Creating RFQ...
//                       </>
//                     ) : (
//                       "Create RFQ"
//                     )}
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>

//           <CustomerSearchDialog
//             open={isCustomerSearchOpen}
//             onOpenChange={setIsCustomerSearchOpen}
//             onSelectCustomer={handleCustomerSelect}
//           />
//         </>
//       )}
//     </div>
//   )

//   if (showCard) {
//     return (
//       <Card>
//         <CardContent className="mt-5">{content}</CardContent>
//       </Card>
//     )
//   }

//   return <div className="space-y-4">{content}</div>
// }















// "use client"
// import { useState, useEffect } from "react"
// import type React from "react"

// import { useRouter } from "next/navigation"
// import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import type { CreateRFQDto } from "@/types/rfq"
// import type { Customer } from "@/types/customer"
// import { CustomerSearchDialog } from "@/components/rfq/customer-search-dialog"
// import { type Specification, fetchServices, fetchSpecifications } from "@/lib/rfq-option"

// // Import modular components
// import { CustomerSelectionStep } from "@/components/rfq/form-sections/customer-selection-step"
// import { FormHeader } from "@/components/rfq/form-sections/form-header"
// import { CustomerInfoCard } from "@/components/rfq/form-sections/customer-info-card"
// import { BasicInfoSection } from "@/components/rfq/form-sections/basic-info-section"
// import { ServicesSection } from "@/components/rfq/form-sections/services-section"
// import { SpecificationsSection } from "@/components/rfq/form-sections/specifications-section"
// import { SuccessState } from "@/components/rfq/form-sections/success-state"
// import { createRFQ } from "@/lib/rfq"
// import { FileUploadSection } from "./form-sections/file-upload-section"


// interface RFQCreateFormProps {
//   onSuccess?: () => void
//   onCancel?: () => void
//   showCard?: boolean
// }

// interface SpecificationValue {
//   specificationId: string
//   value: string
//   unit?: string
// }

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
//     path: string
//     modelType: string
//     modelId?: string
//   }
//   extractedData?: {
//     specifications: any[]
//     assemblyData: any[]
//     images: any[]
//     totalSpecs: number
//   }
// }

// interface RFQFile {
//   id: string
//   filename: string
//   originalname: string
//   size: number
//   mimetype: string
//   extractedSpecs?: any[]
//   extractedAssembly?: any[]
//   extractedImages?: any[]
// }

// export function RFQCreateForm({ onSuccess, onCancel, showCard = true }: RFQCreateFormProps) {
//   // Step tracking
//   const [step, setStep] = useState<"customer-selection" | "form-completion">("customer-selection")

//   // Basic Information
//   const [title, setTitle] = useState("")
//   const [description, setDescription] = useState("")
//   const [quantity, setQuantity] = useState("")
//   const [status, setStatus] = useState("draft")

//   // Customer Information
//   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
//   const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState(false)

//   // Services
//   const [selectedServices, setSelectedServices] = useState<string[]>([])

//   // Specifications
//   const [specifications, setSpecifications] = useState<Specification[]>([])
//   const [specificationValues, setSpecificationValues] = useState<SpecificationValue[]>([])
//   const [extractedSpecifications, setExtractedSpecifications] = useState<SpecificationValue[]>([])

//   // Files
//   const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
//   const [isUploading, setIsUploading] = useState(false)
//   const [fileUploadError, setFileUploadError] = useState<string | null>(null)

//   // Form state
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [isSubmitted, setIsSubmitted] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState(false)
//   const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

//   // Data from APIs
//   const [services, setServices] = useState<any[]>([])
//   const [isLoadingServices, setIsLoadingServices] = useState(false)
//   const [servicesError, setServicesError] = useState<string | null>(null)
//   const [isLoadingSpecifications, setIsLoadingSpecifications] = useState(false)
//   const [specificationsError, setSpecificationsError] = useState<string | null>(null)

//   const router = useRouter()

//   // Load services and specifications when moving to form completion step
//   useEffect(() => {
//     if (step === "form-completion") {
//       loadServices()
//       loadSpecifications()
//     }
//   }, [step])

//   const loadServices = async () => {
//     setIsLoadingServices(true)
//     setServicesError(null)

//     try {
//       const servicesData = await fetchServices()
//       setServices(servicesData.filter((service) => service.isActive && !service.deletedAt))
//     } catch (err) {
//       console.error("Failed to load services:", err)
//       setServicesError("Failed to load services. Some features may not be available.")
//     } finally {
//       setIsLoadingServices(false)
//     }
//   }

//   const loadSpecifications = async () => {
//     setIsLoadingSpecifications(true)
//     setSpecificationsError(null)

//     try {
//       const specificationsData = await fetchSpecifications()
//       setSpecifications(specificationsData.filter((spec) => spec.isActive && !spec.isDeleted))
//     } catch (err) {
//       console.error("Failed to load specifications:", err)
//       setSpecificationsError("Failed to load specifications. Some features may not be available.")
//     } finally {
//       setIsLoadingSpecifications(false)
//     }
//   }

//   const resetForm = () => {
//     setStep("customer-selection")
//     setTitle("")
//     setDescription("")
//     setQuantity("")
//     setStatus("draft")
//     setSelectedCustomer(null)
//     setSelectedServices([])
//     setSpecificationValues([])
//     setExtractedSpecifications([])
//     setUploadingFiles([])
//     setIsUploading(false)
//     setFileUploadError(null)
//     setFormErrors({})
//     setError(null)
//     setSuccess(false)
//     setIsSubmitted(false)
//     setIsSubmitting(false)
//   }

//   const handleCustomerSelect = (customer: Customer) => {
//     setSelectedCustomer(customer)
//     setStep("form-completion")
//   }

//   const handleChangeCustomer = () => {
//     setIsCustomerSearchOpen(true)
//   }

//   const handleBackToCustomerSelection = () => {
//     setStep("customer-selection")
//   }

//   // Handle specification change
//   const handleSpecificationChange = (specId: string, value: string | number | boolean) => {
//     setSpecificationValues((prev) => {
//       const existingIndex = prev.findIndex((spec) => spec.specificationId === specId)

//       if (!value || value === "" || value === false) {
//         return existingIndex >= 0 ? prev.filter((_, index) => index !== existingIndex) : prev
//       }

//       if (existingIndex >= 0) {
//         return prev.map((spec, index) => (index === existingIndex ? { ...spec, value: String(value) } : spec))
//       }

//       return [...prev, { specificationId: specId, value: String(value) }]
//     })
//   }

//   // Handle service toggle
//   const handleServiceToggle = (serviceId: string) => {
//     setSelectedServices((prev) =>
//       prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
//     )
//   }

//   // Remove file
//   const removeFile = (fileId: string) => {
//     setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId))
//   }

//   // Handle extracted specifications from file upload
//   const handleSpecsExtracted = (extractedSpecs: any[]) => {
//     console.log("📊 Processing extracted specifications:", extractedSpecs)

//     // Convert extracted specs to the format expected by the form
//     const convertedSpecs: SpecificationValue[] = extractedSpecs
//       .map((spec) => ({
//         specificationId: spec.specificationId || spec.id,
//         value: String(spec.value || spec.defaultValue || ""),
//         unit: spec.unit,
//       }))
//       .filter((spec) => spec.value && spec.value !== "")

//     // Update extracted specifications state
//     setExtractedSpecifications((prev) => {
//       // Merge with existing extracted specs, avoiding duplicates
//       const merged = [...prev]
//       convertedSpecs.forEach((newSpec) => {
//         const existingIndex = merged.findIndex((s) => s.specificationId === newSpec.specificationId)
//         if (existingIndex >= 0) {
//           merged[existingIndex] = newSpec // Update existing
//         } else {
//           merged.push(newSpec) // Add new
//         }
//       })
//       return merged
//     })

//     console.log(`✅ Added ${convertedSpecs.length} extracted specifications to form`)
//   }

//   // Handle manual file upload - simplified since extraction happens during upload
//   const handleUploadFiles = async () => {
//     // The FileUploadSection component now handles the upload and extraction
//     console.log("🔄 Upload initiated by FileUploadSection component")
//   }

//   // Form validation
//   const validateForm = (): boolean => {
//     let valid = true
//     const newFormErrors: { [key: string]: string } = {}

//     if (!selectedCustomer) {
//       newFormErrors.customer = "Customer selection is required."
//       valid = false
//     }
//     if (!title.trim()) {
//       newFormErrors.title = "Title is required."
//       valid = false
//     }

//     setFormErrors(newFormErrors)
//     return valid
//   }

//   // Simplified submit function since file processing happens during upload
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     console.log("🚀 Form submission started")

//     setError(null)
//     setFileUploadError(null)

//     // Validate form
//     if (!validateForm()) {
//       console.log("❌ Form validation failed")
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       // Check if there are any pending files
//       const pendingFiles = uploadingFiles.filter((f) => f.status === "pending")
//       if (pendingFiles.length > 0) {
//         setError("Please upload all files before submitting the form.")
//         setIsSubmitting(false)
//         return
//       }

//       // Get uploaded file IDs
//       const completedFiles = uploadingFiles.filter(
//         (f) => (f.status === "completed" || f.status === "extracted") && f.serverData,
//       )
//       const fileIds = completedFiles.map((f) => ({ id: f.serverData!.id }))

//       // Combine manual and extracted specifications
//       const allSpecifications = [...specificationValues, ...extractedSpecifications]
//       const uniqueSpecifications = allSpecifications.reduce((acc, spec) => {
//         const existingIndex = acc.findIndex((s) => s.specificationId === spec.specificationId)
//         if (existingIndex >= 0) {
//           // Keep the latest value (manual input takes precedence over extracted)
//           acc[existingIndex] = spec
//         } else {
//           acc.push(spec)
//         }
//         return acc
//       }, [] as SpecificationValue[])

//       console.log("📝 Creating RFQ with data:", {
//         title,
//         description,
//         status,
//         quantity,
//         customerId: selectedCustomer?.id,
//         servicesCount: selectedServices.length,
//         specificationsCount: uniqueSpecifications.length,
//         filesCount: fileIds.length,
//         extractedSpecsCount: extractedSpecifications.length,
//       })

//       const rfqData: CreateRFQDto = {
//         title: title.trim(),
//         description: description.trim(),
//         status,
//         quantity: quantity.trim(),
//         customerId: selectedCustomer!.id,
//         ...(selectedServices.length > 0 && { services: selectedServices }),
//         ...(uniqueSpecifications.length > 0 && { rfqSpecifications: uniqueSpecifications }),
//         ...(fileIds.length > 0 && { files: fileIds }),
//       }

//       console.log("📤 Submitting RFQ data:", rfqData)
//       const createdRFQ = await createRFQ(rfqData)
//       console.log("✅ RFQ created successfully:", createdRFQ)

//       // Update file associations with the new RFQ ID if needed
//       if (completedFiles.length > 0 && createdRFQ.id) {
//         console.log(`🔄 Updating file associations for RFQ ID: ${createdRFQ.id}`)

//         // For each file, update the filename to include the RFQ ID
//         for (const file of completedFiles) {
//           try {
//             await fetch(`${API_BASE_URL}/upload/update-filename/${file.serverData!.id}/${createdRFQ.id}`, {
//               method: "PUT",
//             })
//           } catch (error) {
//             console.warn(`⚠️ Failed to update filename for file ${file.serverData!.id}:`, error)
//             // Non-critical error, continue with other files
//           }
//         }
//       }

//       setSuccess(true)
//       setIsSubmitted(true)

//       if (onSuccess) {
//         setTimeout(() => {
//           onSuccess()
//         }, 1500)
//       }
//     } catch (err) {
//       console.error("❌ Error creating RFQ:", err)

//       if (err instanceof Error) {
//         if (err.message.includes("Customer not found")) {
//           setError("The selected customer is no longer available. Please select a different customer.")
//           setSelectedCustomer(null)
//           setStep("customer-selection")
//         } else if (err.message.includes("Validation failed")) {
//           setError(err.message)
//         } else {
//           setError(err.message || "Failed to create RFQ. Please try again.")
//         }
//       } else {
//         setError("Failed to create RFQ. Please try again.")
//       }
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   // Success state
//   if (isSubmitted) {
//     return (
//       <SuccessState
//         onReset={resetForm}
//         onViewRFQs={() => router.push("/dashboard/rfq")}
//         extractedSpecifications={extractedSpecifications}
//         uploadingFiles={uploadingFiles}
//       />
//     )
//   }

//   // Customer Selection Step
//   if (step === "customer-selection") {
//     const content = (
//       <CustomerSelectionStep
//         isCustomerSearchOpen={isCustomerSearchOpen}
//         setIsCustomerSearchOpen={setIsCustomerSearchOpen}
//         onCustomerSelect={handleCustomerSelect}
//         error={error}
//       />
//     )

//     if (showCard) {
//       return (
//         <Card>
//           <CardContent className="mt-5">{content}</CardContent>
//         </Card>
//       )
//     }

//     return <div className="space-y-4">{content}</div>
//   }

//   // Form Completion Step
//   const isLoading = isLoadingServices || isLoadingSpecifications
//   const isFormDisabled = isSubmitting || success
//   const hasExtractedSpecs = extractedSpecifications.length > 0

//   const content = (
//     <div className="space-y-6">
//       {/* Header */}
//       <FormHeader
//         customer={selectedCustomer}
//         onBackToCustomerSelection={handleBackToCustomerSelection}
//         isLoading={isLoading}
//       />
//       {/* Loading state */}
//       {isLoading && <div />} {/* Empty div to prevent content flash */}
//       {/* Form content */}
//       {!isLoading && (
//         <>
//           {/* Customer Info Card */}
//           <CustomerInfoCard customer={selectedCustomer!} onChangeCustomer={handleChangeCustomer} />

//           {/* Extracted Specifications Alert */}
//           {hasExtractedSpecs && (
//             <Alert className="bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
//               <CheckCircle className="h-4 w-4" />
//               <AlertDescription>
//                 ✅ Automatically extracted {extractedSpecifications.length} specifications from uploaded Excel files.
//                 You can review and modify them in the specifications section below.
//               </AlertDescription>
//             </Alert>
//           )}

//           {/* Error Display */}
//           {error && (
//             <Alert variant="destructive">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           {/* Success Alert */}
//           {success && (
//             <Alert className="bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
//               <CheckCircle className="h-4 w-4" />
//               <AlertDescription>RFQ created successfully!</AlertDescription>
//             </Alert>
//           )}

//           {/* Main Form */}
//           <Card>
//             <CardContent className="p-6">
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Basic Information */}
//                 <BasicInfoSection
//                   title={title}
//                   setTitle={setTitle}
//                   quantity={quantity}
//                   setQuantity={setQuantity}
//                   status={status}
//                   setStatus={setStatus}
//                   description={description}
//                   setDescription={setDescription}
//                   formErrors={formErrors}
//                   disabled={isFormDisabled}
//                 />

//                 {/* Services */}
//                 <ServicesSection
//                   services={services}
//                   selectedServices={selectedServices}
//                   onServiceToggle={handleServiceToggle}
//                   disabled={isFormDisabled}
//                 />

//                 {/* Specifications */}
//                 {/* <SpecificationsSection
//                   specifications={specifications}
//                   specificationValues={specificationValues}
//                   onSpecificationChange={handleSpecificationChange}
//                   disabled={isFormDisabled}
//                   extractedCount={extractedSpecifications.length}
//                 /> */}

//                 {/* File Upload - Updated with new props */}
//                 <FileUploadSection
//                   uploadingFiles={uploadingFiles}
//                   setUploadingFiles={setUploadingFiles}
//                   isUploading={isUploading}
//                   fileUploadError={fileUploadError}
//                   setFileUploadError={setFileUploadError}
//                   onUploadFiles={handleUploadFiles}
//                   onRemoveFile={removeFile}
//                   disabled={isFormDisabled}
//                   rfqId={selectedCustomer?.id ? `temp-${selectedCustomer.id}` : undefined}
//                   // apiBaseUrl={API_BASE_URL}
//                   onSpecsExtracted={handleSpecsExtracted}
//                 />

//                 {/* Submit Button */}
//                 <div className="flex justify-end space-x-2 pt-4">
//                   {onCancel && (
//                     <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
//                       Cancel
//                     </Button>
//                   )}
//                   <Button type="submit" disabled={isSubmitting || success}>
//                     {isSubmitting ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Creating RFQ...
//                       </>
//                     ) : (
//                       "Create RFQ"
//                     )}
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>

//           <CustomerSearchDialog
//             open={isCustomerSearchOpen}
//             onOpenChange={setIsCustomerSearchOpen}
//             onSelectCustomer={handleCustomerSelect}
//           />
//         </>
//       )}
//     </div>
//   )

//   if (showCard) {
//     return (
//       <Card>
//         <CardContent className="mt-5">{content}</CardContent>
//       </Card>
//     )
//   }

//   return <div className="space-y-4">{content}</div>
// }











































"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { CreateRFQDto } from "@/types/rfq"
import type { Customer } from "@/types/customer"
import { CustomerSearchDialog } from "@/components/rfq/customer-search-dialog"
import { fetchServices } from "@/lib/service"
import { type Specification, fetchSpecifications } from "@/lib/rfq-option"

// Import modular components
import { CustomerSelectionStep } from "@/components/rfq/form-sections/customer-selection-step"
import { FormHeader } from "@/components/rfq/form-sections/form-header"
import { CustomerInfoCard } from "@/components/rfq/form-sections/customer-info-card"
import { BasicInfoSection } from "@/components/rfq/form-sections/basic-info-section"
import { ServicesSection } from "@/components/rfq/form-sections/services-section"
import { SpecificationsSection } from "@/components/rfq/form-sections/specifications-section"
import { SuccessState } from "@/components/rfq/form-sections/success-state"
import { createRFQ } from "@/lib/rfq"
import { FileUploadSection } from "./form-sections/file-upload-section"

interface RFQCreateFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  showCard?: boolean
}

interface SpecificationValue {
  specificationId: string
  value: string
  unit?: string
}

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

interface RFQFile {
  id: string
  filename: string
  originalname: string
  size: number
  mimetype: string
  extractedSpecs?: any[]
  extractedAssembly?: any[]
  extractedImages?: any[]
}

export function RFQCreateForm({ onSuccess, onCancel, showCard = true }: RFQCreateFormProps) {
  // Step tracking
  const [step, setStep] = useState<"customer-selection" | "form-completion">("customer-selection")

  // Basic Information
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [quantity, setQuantity] = useState("")
  const [status, setStatus] = useState("draft")

  // Customer Information
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState(false)

  // Services
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  // Specifications
  const [specifications, setSpecifications] = useState<Specification[]>([])
  const [specificationValues, setSpecificationValues] = useState<SpecificationValue[]>([])
  const [extractedSpecifications, setExtractedSpecifications] = useState<SpecificationValue[]>([])

  // Files
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [fileUploadError, setFileUploadError] = useState<string | null>(null)

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  // Data from APIs
  const [services, setServices] = useState<any[]>([])
  const [isLoadingServices, setIsLoadingServices] = useState(false)
  const [servicesError, setServicesError] = useState<string | null>(null)
  const [isLoadingSpecifications, setIsLoadingSpecifications] = useState(false)
  const [specificationsError, setSpecificationsError] = useState<string | null>(null)

  const router = useRouter()

  // Load services and specifications when moving to form completion step
  useEffect(() => {
    if (step === "form-completion") {
      loadServices()
      loadSpecifications()
    }
  }, [step])

  const loadServices = async () => {
    setIsLoadingServices(true)
    setServicesError(null)

    try {
      const servicesData = await fetchServices()
      setServices(servicesData.filter((service) => service.isActive && !service.deletedAt))
    } catch (err) {
      console.error("Failed to load services:", err)
      setServicesError("Failed to load services. Some features may not be available.")
    } finally {
      setIsLoadingServices(false)
    }
  }

  const loadSpecifications = async () => {
    setIsLoadingSpecifications(true)
    setSpecificationsError(null)

    try {
      const specificationsData = await fetchSpecifications()
      setSpecifications(specificationsData.filter((spec) => spec.isActive && !spec.isDeleted))
    } catch (err) {
      console.error("Failed to load specifications:", err)
      setSpecificationsError("Failed to load specifications. Some features may not be available.")
    } finally {
      setIsLoadingSpecifications(false)
    }
  }

  const resetForm = () => {
    setStep("customer-selection")
    setTitle("")
    setDescription("")
    setQuantity("")
    setStatus("draft")
    setSelectedCustomer(null)
    setSelectedServices([])
    setSpecificationValues([])
    setExtractedSpecifications([])
    setUploadingFiles([])
    setIsUploading(false)
    setFileUploadError(null)
    setFormErrors({})
    setError(null)
    setSuccess(false)
    setIsSubmitted(false)
    setIsSubmitting(false)
  }

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer)
    setStep("form-completion")
  }

  const handleChangeCustomer = () => {
    setIsCustomerSearchOpen(true)
  }

  const handleBackToCustomerSelection = () => {
    setStep("customer-selection")
  }

  // Handle specification change
  const handleSpecificationChange = (specId: string, value: string | number | boolean) => {
    setSpecificationValues((prev) => {
      const existingIndex = prev.findIndex((spec) => spec.specificationId === specId)

      if (!value || value === "" || value === false) {
        return existingIndex >= 0 ? prev.filter((_, index) => index !== existingIndex) : prev
      }

      if (existingIndex >= 0) {
        return prev.map((spec, index) => (index === existingIndex ? { ...spec, value: String(value) } : spec))
      }

      return [...prev, { specificationId: specId, value: String(value) }]
    })
  }

  // Handle service toggle
  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  // Remove file
  const removeFile = (fileId: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  // Handle extracted specifications from file upload - REMOVED EXTRACTION
  const handleSpecsExtracted = (extractedSpecs: any[]) => {
    // No extraction functionality - just log
    console.log("File uploaded successfully")
  }

  // Handle manual file upload - simplified since extraction happens during upload
  const handleUploadFiles = async () => {
    // The FileUploadSection component now handles the upload and extraction
    console.log("🔄 Upload initiated by FileUploadSection component")
  }

  // Form validation
  const validateForm = (): boolean => {
    let valid = true
    const newFormErrors: { [key: string]: string } = {}

    if (!selectedCustomer) {
      newFormErrors.customer = "Customer selection is required."
      valid = false
    }
    if (!title.trim()) {
      newFormErrors.title = "Title is required."
      valid = false
    }

    setFormErrors(newFormErrors)
    return valid
  }

  // Simplified submit function since file processing happens during upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("🚀 Form submission started")

    setError(null)
    setFileUploadError(null)

    // Validate form
    if (!validateForm()) {
      console.log("❌ Form validation failed")
      return
    }

    setIsSubmitting(true)

    try {
      // Check if there are any pending files
      const pendingFiles = uploadingFiles.filter((f) => f.status === "pending")
      if (pendingFiles.length > 0) {
        setError("Please upload all files before submitting the form.")
        setIsSubmitting(false)
        return
      }

      // Get uploaded file IDs
      const completedFiles = uploadingFiles.filter(
        (f) => (f.status === "completed" || f.status === "extracted") && f.serverData,
      )
      const fileIds = completedFiles.map((f) => ({ id: f.serverData!.id }))

      // Combine manual and extracted specifications
      const uniqueSpecifications = [...specificationValues]

      console.log("📝 Creating RFQ with data:", {
        title,
        description,
        status,
        quantity,
        customerId: selectedCustomer?.id,
        servicesCount: selectedServices.length,
        specificationsCount: uniqueSpecifications.length,
        filesCount: fileIds.length,
        extractedSpecsCount: extractedSpecifications.length,
      })

      const rfqData: CreateRFQDto = {
        title: title.trim(),
        description: description.trim(),
        status,
        quantity: quantity.trim(),
        customerId: selectedCustomer!.id,
        ...(selectedServices.length > 0 && { services: selectedServices }),
        ...(uniqueSpecifications.length > 0 && { rfqSpecifications: uniqueSpecifications }),
        ...(fileIds.length > 0 && { files: fileIds }),
      }

      console.log("📤 Submitting RFQ data:", rfqData)
      const createdRFQ = await createRFQ(rfqData)
      console.log("✅ RFQ created successfully:", createdRFQ)

      // Update file associations with the new RFQ ID if needed
      if (completedFiles.length > 0 && createdRFQ.id) {
        console.log(`🔄 Updating file associations for RFQ ID: ${createdRFQ.id}`)

        // For each file, update the filename to include the RFQ ID
        for (const file of completedFiles) {
          try {
            await fetch(`${API_BASE_URL}/upload/update-filename/${file.serverData!.id}/${createdRFQ.id}`, {
              method: "PUT",
            })
          } catch (error) {
            console.warn(`⚠️ Failed to update filename for file ${file.serverData!.id}:`, error)
            // Non-critical error, continue with other files
          }
        }
      }

      setSuccess(true)
      setIsSubmitted(true)

      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 1500)
      }
    } catch (err) {
      console.error("❌ Error creating RFQ:", err)

      if (err instanceof Error) {
        if (err.message.includes("Customer not found")) {
          setError("The selected customer is no longer available. Please select a different customer.")
          setSelectedCustomer(null)
          setStep("customer-selection")
        } else if (err.message.includes("Validation failed")) {
          setError(err.message)
        } else {
          setError(err.message || "Failed to create RFQ. Please try again.")
        }
      } else {
        setError("Failed to create RFQ. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success state
  if (isSubmitted) {
    return (
      <SuccessState
        onReset={resetForm}
        onViewRFQs={() => router.push("/dashboard/rfq")}
        extractedSpecifications={extractedSpecifications}
        uploadingFiles={uploadingFiles}
      />
    )
  }

  // Customer Selection Step
  if (step === "customer-selection") {
    const content = (
      <CustomerSelectionStep
        isCustomerSearchOpen={isCustomerSearchOpen}
        setIsCustomerSearchOpen={setIsCustomerSearchOpen}
        onCustomerSelect={handleCustomerSelect}
        error={error}
      />
    )

    if (showCard) {
      return (
        <Card>
          <CardContent className="mt-5">{content}</CardContent>
        </Card>
      )
    }

    return <div className="space-y-4">{content}</div>
  }

  // Form Completion Step
  const isLoading = isLoadingServices || isLoadingSpecifications
  const isFormDisabled = isSubmitting || success
  const content = (
    <div className="space-y-6">
      {/* Header */}
      <FormHeader
        customer={selectedCustomer}
        onBackToCustomerSelection={handleBackToCustomerSelection}
        isLoading={isLoading}
      />
      {/* Loading state */}
      {isLoading && <div />} {/* Empty div to prevent content flash */}
      {/* Form content */}
      {!isLoading && (
        <>
          {/* Customer Info Card */}
          <CustomerInfoCard customer={selectedCustomer!} onChangeCustomer={handleChangeCustomer} />

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>RFQ created successfully!</AlertDescription>
            </Alert>
          )}

          {/* Main Form */}
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <BasicInfoSection
                  title={title}
                  setTitle={setTitle}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  status={status}
                  setStatus={setStatus}
                  description={description}
                  setDescription={setDescription}
                  formErrors={formErrors}
                  disabled={isFormDisabled}
                />

                {/* Services */}
                <ServicesSection
                  services={services}
                  selectedServices={selectedServices}
                  onServiceToggle={handleServiceToggle}
                  disabled={isFormDisabled}
                />

                {/* Specifications */}
                {/* <SpecificationsSection
                  specifications={specifications}
                  specificationValues={specificationValues}
                  onSpecificationChange={handleSpecificationChange}
                  disabled={isFormDisabled}
                  extractedCount={extractedSpecifications.length}
                /> */}

                {/* File Upload - Updated with new props */}
                <FileUploadSection
                  uploadingFiles={uploadingFiles}
                  setUploadingFiles={setUploadingFiles}
                  isUploading={isUploading}
                  fileUploadError={fileUploadError}
                  setFileUploadError={setFileUploadError}
                  onUploadFiles={handleUploadFiles}
                  onRemoveFile={removeFile}
                  disabled={isFormDisabled}
                  rfqId={selectedCustomer?.id ? `temp-${selectedCustomer.id}` : undefined}
                  // apiBaseUrl={API_BASE_URL}
                  onSpecsExtracted={handleSpecsExtracted}
                />

                {/* Submit Button */}
                <div className="flex justify-end space-x-2 pt-4">
                  {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                      Cancel
                    </Button>
                  )}
                  <Button type="submit" disabled={isSubmitting || success}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating RFQ...
                      </>
                    ) : (
                      "Create RFQ"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <CustomerSearchDialog
            open={isCustomerSearchOpen}
            onOpenChange={setIsCustomerSearchOpen}
            onSelectCustomer={handleCustomerSelect}
          />
        </>
      )}
    </div>
  )

  if (showCard) {
    return (
      <Card>
        <CardContent className="mt-5">{content}</CardContent>
      </Card>
    )
  }

  return <div className="space-y-4">{content}</div>
}
