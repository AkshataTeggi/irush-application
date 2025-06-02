
// "use client"
// import { useState, useEffect, useCallback } from "react"
// import type React from "react"

// import { useRouter } from "next/navigation"
// import { Mail, CheckCircle, Upload, X, AlertCircle, Loader2, ArrowLeft } from "lucide-react"
// import { useDropzone } from "react-dropzone"

// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import type { CreateRFQDto } from "@/types/rfq"
// import { createRFQ } from "@/lib/rfq"
// import { RFQ_STATUSES } from "@/types/rfq"
// import type { Customer } from "@/types/customer"
// import { CustomerSearchDialog } from "@/components/rfq/customer-search-dialog"
// import { Specification, fetchServices, fetchSpecifications } from "@/lib/rfq-option"

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
//   status: "pending" | "uploading" | "completed" | "error"
//   error?: string
//   uploadedBytes: number
//   serverData?: {
//     id: string
//     filename: string
//     originalname: string
//     size: number
//     mimetype: string
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
//   }

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

//   // File upload with dropzone
//   const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
//     setFileUploadError(null)

//     if (rejectedFiles.length > 0) {
//       const rejectedNames = rejectedFiles.map((f) => f.file.name).join(", ")
//       setFileUploadError(`Some files were rejected: ${rejectedNames}`)
//     }

//     const validFiles: File[] = []
//     const oversizedFiles: string[] = []

//     acceptedFiles.forEach((file) => {
//       if (file.size > 1024 * 1024 * 1024) {
//         // 1GB limit
//         oversizedFiles.push(file.name)
//       } else {
//         validFiles.push(file)
//       }
//     })

//     if (oversizedFiles.length > 0) {
//       setFileUploadError(`Files exceed 1GB limit: ${oversizedFiles.join(", ")}`)
//     }

//     const newUploadingFiles: UploadingFile[] = validFiles.map((file) => ({
//       file,
//       id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//       progress: 0,
//       status: "pending",
//       uploadedBytes: 0,
//     }))

//     setUploadingFiles((prev) => [...prev, ...newUploadingFiles])
//   }, [])

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: acceptedFileTypes,
//     maxSize: 1024 * 1024 * 1024, // 1GB
//     multiple: true,
//   })

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

//   // Get status icon
//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "completed":
//         return <CheckCircle className="h-4 w-4 text-green-500" />
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

//   // Render specification input
//   const renderSpecificationInput = (spec: Specification) => {
//     const currentValue = specificationValues.find((s) => s.specificationId === spec.id)?.value || ""

//     switch (spec.type || "TEXT") {
//       case "TEXT":
//         return (
//           <Input
//             value={currentValue}
//             onChange={(e) => handleSpecificationChange(spec.id, e.target.value)}
//             placeholder={`Enter ${spec.name}`}
//           />
//         )

//       case "SELECT":
//       case "DROPDOWN":
//         const options = spec.suggestions || []
//         return (
//           <Select value={currentValue || ""} onValueChange={(value) => handleSpecificationChange(spec.id, value)}>
//             <SelectTrigger>
//               <SelectValue placeholder={`Select ${spec.name}`} />
//             </SelectTrigger>
//             <SelectContent>
//               {options.map((option, index) => (
//                 <SelectItem key={index} value={option}>
//                   {option}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         )

//       case "CHECKBOX":
//         return (
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               checked={currentValue === "true"}
//               onCheckedChange={(checked) => handleSpecificationChange(spec.id, checked)}
//             />
//             <Label className="text-sm">{spec.name}</Label>
//           </div>
//         )

//       default:
//         return (
//           <Input
//             value={currentValue}
//             onChange={(e) => handleSpecificationChange(spec.id, e.target.value)}
//             placeholder={`Enter ${spec.name}`}
//           />
//         )
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

//   // Update the file upload handling functions

//   // Upload single file with progress tracking
//   const uploadSingleFile = async (uploadingFile: UploadingFile): Promise<RFQFile> => {
//     const { file, id } = uploadingFile

//     return new Promise((resolve, reject) => {
//       const formData = new FormData()
//       formData.append("files", file)

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
//       xhr.addEventListener("load", () => {
//         if (xhr.status >= 200 && xhr.status < 300) {
//           try {
//             const response = JSON.parse(xhr.responseText)

//             // Handle NestJS response format
//             let fileData
//             if (Array.isArray(response)) {
//               fileData = response[0]
//             } else if (response.data && Array.isArray(response.data)) {
//               fileData = response.data[0]
//             } else {
//               fileData = response
//             }

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

//       // Set timeout (5 minutes)
//       xhr.timeout = 5 * 60 * 1000
//       xhr.addEventListener("timeout", () => {
//         const errorMessage = "Upload timeout"
//         setUploadingFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "error", error: errorMessage } : f)))
//         reject(new Error(errorMessage))
//       })

//       // Start upload
//       xhr.open("POST", "http://irush-server.rushpcb.com:5000/upload")
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

//       // Get uploaded file IDs
//       const completedFiles = uploadingFiles.filter((f) => f.status === "completed" && f.serverData)
//       const fileIds = completedFiles.map((f) => ({ id: f.serverData!.id }))

//       console.log("📝 Creating RFQ with data:", {
//         title,
//         description,
//         status,
//         quantity,
//         customerId: selectedCustomer?.id,
//         servicesCount: selectedServices.length,
//         specificationsCount: specificationValues.length,
//         filesCount: fileIds.length,
//       })

//       const rfqData: CreateRFQDto = {
//         title: title.trim(),
//         description: description.trim(),
//         status,
//         quantity: quantity.trim(),
//         customerId: selectedCustomer!.id,
//         ...(selectedServices.length > 0 && { services: selectedServices }),
//         ...(specificationValues.length > 0 && { rfqSpecifications: specificationValues }),
//         ...(fileIds.length > 0 && { files: fileIds }),
//       }

//       console.log("📤 Submitting RFQ data:", rfqData)
//       const createdRFQ = await createRFQ(rfqData)
//       console.log("✅ RFQ created successfully:", createdRFQ)

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

//   // Customer Selection Step
//   const renderCustomerSelectionStep = () => (
//     <div className="space-y-6">
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold">Select a Customer</h3>
//         <p className="text-sm text-muted-foreground">
//           First, select a customer for this RFQ. You'll be able to fill in the RFQ details after selecting a customer.
//         </p>

//         <div className="flex space-x-2">
//           <Button type="button" onClick={() => setIsCustomerSearchOpen(true)} className="flex-1">
//             <Mail className="mr-2 h-4 w-4" />
//             Search for a Customer
//           </Button>
//         </div>
//       </div>

//       {error && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       <CustomerSearchDialog
//         open={isCustomerSearchOpen}
//         onOpenChange={setIsCustomerSearchOpen}
//         onSelectCustomer={handleCustomerSelect}
//       />
//     </div>
//   )

//   // Form Completion Step
//   const renderFormCompletionStep = () => {
//     if (isLoadingServices || isLoadingSpecifications) {
//       return (
//         <div className="space-y-6">
//           <div className="flex items-center space-x-2">
//             <Button type="button" variant="ghost" size="sm" onClick={handleBackToCustomerSelection}>
//               <ArrowLeft className="h-4 w-4 mr-1" />
//               Back
//             </Button>
//             <h3 className="text-lg font-semibold">Create RFQ for {selectedCustomer?.name}</h3>
//           </div>

//           <div className="flex items-center justify-center h-32">
//             <Loader2 className="h-6 w-6 animate-spin mr-2" />
//             <span>Loading form options...</span>
//           </div>
//         </div>
//       )
//     }

//     return (
//       <div className="space-y-6">
//         {/* Header with customer info */}
//         <div className="space-y-4">
//           <div className="flex items-center space-x-2">
//             <Button type="button" variant="ghost" size="sm" onClick={handleBackToCustomerSelection}>
//               <ArrowLeft className="h-4 w-4 mr-1" />
//               Back
//             </Button>
//             <h3 className="text-lg font-semibold">Create RFQ for {selectedCustomer?.name}</h3>
//           </div>

//           {/* Customer Information Card */}
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex justify-between items-start mb-2">
//                 <h4 className="font-medium">Customer Information</h4>
//                 <Button type="button" variant="outline" size="sm" onClick={handleChangeCustomer}>
//                   Change Customer
//                 </Button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                 <div>
//                   <span className="font-medium">Name:</span> {selectedCustomer?.name}
//                 </div>
//                 <div>
//                   <span className="font-medium">Email:</span> {selectedCustomer?.email}
//                 </div>
//                 <div>
//                   <span className="font-medium">Phone:</span> {selectedCustomer?.phone}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Error Display */}
//         {error && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         {success && (
//           <Alert className="bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
//             <CheckCircle className="h-4 w-4" />
//             <AlertDescription>RFQ created successfully!</AlertDescription>
//           </Alert>
//         )}

//         {/* Main Form */}
//         <Card>
//           <CardContent className="p-6">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Basic Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="title">
//                     Project Title <span className="text-red-600">*</span>
//                   </Label>
//                   <Input
//                     id="title"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     placeholder="Enter project title"
//                     required
//                     disabled={isSubmitting || success}
//                   />
//                   {formErrors.title && <p className="text-red-500 text-xs">{formErrors.title}</p>}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="quantity">Quantity</Label>
//                   <Input
//                     id="quantity"
//                     value={quantity}
//                     onChange={(e) => setQuantity(e.target.value)}
//                     placeholder="Enter quantity"
//                     disabled={isSubmitting || success}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="status">Status</Label>
//                   <Select value={status} onValueChange={setStatus} disabled={isSubmitting || success}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {RFQ_STATUSES.map((statusOption) => (
//                         <SelectItem key={statusOption.value} value={statusOption.value}>
//                           {statusOption.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               {/* Description */}
//               <div className="space-y-2">
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea
//                   id="description"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   placeholder="Enter description"
//                   rows={4}
//                   disabled={isSubmitting || success}
//                 />
//               </div>

//               {/* Services */}
//               {services.length > 0 && (
//                 <div className="space-y-4">
//                   <Label className="font-medium">Service Type (Check all that apply)</Label>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {services.map((service) => (
//                       <div key={service.id} className="flex items-center space-x-2">
//                         <Checkbox
//                           id={service.id}
//                           checked={selectedServices.includes(service.id)}
//                           onCheckedChange={() => handleServiceToggle(service.id)}
//                           disabled={isSubmitting || success}
//                         />
//                         <Label htmlFor={service.id} className="text-sm">
//                           {service.name}
//                         </Label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Specifications */}
//               <Accordion type="single" collapsible className="w-full">
//                 <AccordionItem value="specifications">
//                   <AccordionTrigger className="font-medium">Add Board Specifications (optional)</AccordionTrigger>
//                   <AccordionContent>
//                     {specifications.length > 0 ? (
//                       <div className="space-y-6">
//                         {/* Non-Checkbox Specifications */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           {specifications
//                             .filter((spec) => (spec.type || "TEXT") !== "CHECKBOX")
//                             .map((spec) => (
//                               <div key={spec.id} className="bg-white p-3 rounded-md shadow-sm border">
//                                 <Label className="font-medium text-sm mb-2 block">
//                                   {spec.name}
//                                   {spec.isRequired && <span className="text-red-500 ml-1">*</span>}
//                                 </Label>
//                                 {renderSpecificationInput(spec)}
//                               </div>
//                             ))}
//                         </div>

//                         {/* Checkbox Specifications */}
//                         {specifications.filter((spec) => (spec.type || "TEXT") === "CHECKBOX").length > 0 && (
//                           <div>
//                             <h3 className="text-sm font-medium mb-3">Additional Options</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               {specifications
//                                 .filter((spec) => (spec.type || "TEXT") === "CHECKBOX")
//                                 .map((spec) => (
//                                   <div key={spec.id} className="bg-white p-3 rounded-md shadow-sm border">
//                                     {renderSpecificationInput(spec)}
//                                   </div>
//                                 ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     ) : (
//                       <p className="text-gray-500 py-2">No specifications available</p>
//                     )}
//                   </AccordionContent>
//                 </AccordionItem>
//               </Accordion>

//               {/* File Upload */}
//               <div className="space-y-4">
//                 <Label className="block mb-2 text-sm font-medium">Upload Files (Optional)</Label>

//                 <div
//                   {...getRootProps()}
//                   className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
//                     isDragActive
//                       ? "border-blue-500 bg-blue-50"
//                       : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
//                   } ${isSubmitting || success ? "opacity-50 pointer-events-none" : ""}`}
//                 >
//                   <input {...getInputProps()} disabled={isSubmitting || success} />
//                   <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
//                   {isDragActive ? (
//                     <p className="text-blue-600">Drop the files here...</p>
//                   ) : (
//                     <div>
//                       <p className="text-gray-600 mb-1">Drag & drop files here, or click to select</p>
//                       <p className="text-sm text-gray-500">Supports files up to 1GB each</p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Upload button for pending files */}
//                 {uploadingFiles.filter((f) => f.status === "pending").length > 0 && !isUploading && (
//                   <div className="flex justify-center">
//                     <Button
//                       type="button"
//                       onClick={handleUploadFiles}
//                       disabled={isSubmitting || success}
//                       className="px-6 py-2"
//                     >
//                       <Upload className="mr-2 h-4 w-4" />
//                       Upload {uploadingFiles.filter((f) => f.status === "pending").length} Files
//                     </Button>
//                   </div>
//                 )}

//                 {/* Upload progress indicator */}
//                 {isUploading && (
//                   <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
//                     <div className="flex items-center space-x-3">
//                       <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
//                       <span className="text-sm font-medium text-blue-700">Uploading files...</span>
//                     </div>
//                   </div>
//                 )}

//                 {/* File List */}
//                 {uploadingFiles.length > 0 && (
//                   <div className="mt-4">
//                     <h4 className="text-sm font-medium mb-2">Files ({uploadingFiles.length}):</h4>
//                     <ul className="space-y-2 max-h-60 overflow-y-auto">
//                       {uploadingFiles.map((uploadingFile) => (
//                         <li
//                           key={uploadingFile.id}
//                           className={`flex items-center justify-between text-sm p-3 rounded border ${
//                             uploadingFile.status === "completed"
//                               ? "bg-green-50 border-green-200"
//                               : uploadingFile.status === "error"
//                                 ? "bg-red-50 border-red-200"
//                                 : uploadingFile.status === "uploading"
//                                   ? "bg-blue-50 border-blue-200"
//                                   : "bg-gray-50 border-gray-200"
//                           }`}
//                         >
//                           <div className="flex items-center space-x-3 flex-grow">
//                             {getStatusIcon(uploadingFile.status)}
//                             <div className="flex-grow min-w-0">
//                               <div className="flex items-center justify-between">
//                                 <span className="truncate font-medium">{uploadingFile.file.name}</span>
//                                 <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
//                                   {(uploadingFile.file.size / (1024 * 1024)).toFixed(2)} MB
//                                 </span>
//                               </div>

//                               {uploadingFile.status === "uploading" && (
//                                 <div className="mt-1">
//                                   <div className="w-full bg-gray-200 rounded-full h-1">
//                                     <div
//                                       className="bg-blue-600 h-1 rounded-full transition-all duration-300"
//                                       style={{ width: `${uploadingFile.progress}%` }}
//                                     />
//                                   </div>
//                                   <span className="text-xs text-blue-600 mt-1">{uploadingFile.progress}%</span>
//                                 </div>
//                               )}

//                               {uploadingFile.status === "error" && uploadingFile.error && (
//                                 <div className="mt-1 text-xs text-red-500">{uploadingFile.error}</div>
//                               )}

//                               {uploadingFile.status === "completed" && (
//                                 <div className="mt-1 text-xs text-green-600">Upload completed</div>
//                               )}
//                             </div>
//                           </div>

//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => removeFile(uploadingFile.id)}
//                             disabled={uploadingFile.status === "uploading" || isSubmitting}
//                             className="h-8 w-8 p-0 ml-2 flex-shrink-0"
//                           >
//                             <X className="h-4 w-4" />
//                           </Button>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {fileUploadError && (
//                   <Alert variant="destructive">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertDescription>{fileUploadError}</AlertDescription>
//                   </Alert>
//                 )}

//                 {/* File format info */}
//                 <Accordion type="single" collapsible className="w-full">
//                   <AccordionItem value="file-info">
//                     <AccordionTrigger className="text-sm text-gray-600">Supported file formats</AccordionTrigger>
//                     <AccordionContent>
//                       <div className="text-xs text-gray-600 space-y-2">
//                         <p>
//                           <strong>Archives:</strong> ZIP, RAR
//                         </p>
//                         <p>
//                           <strong>Documents:</strong> PDF, DOC, DOCX, XLS, XLSX, CSV, TXT
//                         </p>
//                         <p>
//                           <strong>Images:</strong> JPG, JPEG, PNG, SVG
//                         </p>
//                         <p>
//                           <strong>CAD/PCB:</strong> SCH, BRD, PCB, DXF, DWG, STEP, STP, GBR, DRL
//                         </p>
//                         <p className="text-red-600">
//                           <strong>Max size:</strong> 1GB per file
//                         </p>
//                       </div>
//                     </AccordionContent>
//                   </AccordionItem>
//                 </Accordion>
//               </div>

//               {/* Submit Button */}
//               <div className="flex justify-end space-x-2 pt-4">
//                 {onCancel && (
//                   <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
//                     Cancel
//                   </Button>
//                 )}
//                 <Button type="submit" disabled={isSubmitting || success}>
//                   {isSubmitting ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Creating RFQ...
//                     </>
//                   ) : (
//                     "Create RFQ"
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>

//         <CustomerSearchDialog
//           open={isCustomerSearchOpen}
//           onOpenChange={setIsCustomerSearchOpen}
//           onSelectCustomer={handleCustomerSelect}
//         />
//       </div>
//     )
//   }

//   // Success state
//   if (isSubmitted) {
//     return (
//       <div className="p-8 max-w-md mx-auto">
//         <div className="bg-white rounded-lg shadow-xl p-6 border-t-4 border-t-green-500">
//           <div className="flex flex-col items-center text-center">
//             <div className="rounded-full bg-green-100 p-3 mb-4">
//               <CheckCircle className="text-green-500 h-12 w-12" />
//             </div>
//             <h2 className="text-2xl font-bold text-green-700 mb-2">RFQ Created Successfully!</h2>
//             <p className="text-gray-600 mb-6">
//               Your RFQ has been created successfully. You can now manage it from the RFQ dashboard.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 w-full">
//               <Button onClick={resetForm} variant="outline" className="flex-1">
//                 Create Another RFQ
//               </Button>
//               <Button onClick={() => router.push("/dashboard/rfq")} className="flex-1 bg-green-600 hover:bg-green-700">
//                 View RFQs
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   const content = step === "customer-selection" ? renderCustomerSelectionStep() : renderFormCompletionStep()

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
import { type Specification, fetchServices, fetchSpecifications } from "@/lib/rfq-option"

// Import modular components
import { CustomerSelectionStep } from "@/components/rfq/form-sections/customer-selection-step"
import { FormHeader } from "@/components/rfq/form-sections/form-header"
import { CustomerInfoCard } from "@/components/rfq/form-sections/customer-info-card"
import { BasicInfoSection } from "@/components/rfq/form-sections/basic-info-section"
import { ServicesSection } from "@/components/rfq/form-sections/services-section"
import { SpecificationsSection } from "@/components/rfq/form-sections/specifications-section"
import { FileUploadSection } from "@/components/rfq/form-sections/file-upload-section"
import { SuccessState } from "@/components/rfq/form-sections/success-state"
import { createRFQ } from "@/lib/rfq"

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

  // Check if file is Excel
  const isExcelFile = (file: File): boolean => {
    const excelTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
    const excelExtensions = [".xls", ".xlsx"]
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."))

    return excelTypes.includes(file.type) || excelExtensions.includes(fileExtension)
  }

  // Upload single file with immediate Excel processing for Excel files
  const uploadSingleFile = async (uploadingFile: UploadingFile): Promise<RFQFile> => {
    const { file, id } = uploadingFile

    return new Promise((resolve, reject) => {
      console.log(`🚀 Starting upload for: ${file.name}`)

      // Update status to uploading
      setUploadingFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "uploading", progress: 0, uploadedBytes: 0 } : f)),
      )

      // Check if it's an Excel file
      if (isExcelFile(file)) {
        // For Excel files, we'll upload and then immediately process
        uploadExcelFileWithProcessing(uploadingFile).then(resolve).catch(reject)
      } else {
        // For regular files, use normal upload
        uploadRegularFile(uploadingFile).then(resolve).catch(reject)
      }
    })
  }

  // Upload regular (non-Excel) files
  const uploadRegularFile = async (uploadingFile: UploadingFile): Promise<RFQFile> => {
    const { file, id } = uploadingFile

    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append("files", file)

      const xhr = new XMLHttpRequest()

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploadingFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, progress, uploadedBytes: event.loaded } : f)),
          )
        }
      })

      // Handle successful upload
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            const fileData = Array.isArray(response) ? response[0] : response

            const serverData = {
              id: fileData?.id || id,
              filename: fileData?.filename || file.name,
              originalname: fileData?.originalname || file.name,
              size: fileData?.size || file.size,
              mimetype: fileData?.mimetype || file.type,
            }

            setUploadingFiles((prev) =>
              prev.map((f) => (f.id === id ? { ...f, status: "completed", progress: 100, serverData } : f)),
            )

            console.log(`✅ Upload completed for: ${file.name}`)
            resolve(fileData)
          } catch (error) {
            const errorMessage = "Invalid server response"
            setUploadingFiles((prev) =>
              prev.map((f) => (f.id === id ? { ...f, status: "error", error: errorMessage } : f)),
            )
            reject(new Error(errorMessage))
          }
        } else {
          let errorMessage = `Upload failed: ${xhr.status}`
          if (xhr.status === 413) errorMessage = "File too large (max 1GB)"
          else if (xhr.status === 400) errorMessage = "Invalid file type"

          setUploadingFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, status: "error", error: errorMessage } : f)),
          )
          reject(new Error(errorMessage))
        }
      })

      xhr.addEventListener("error", () => {
        const errorMessage = "Network error occurred"
        setUploadingFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "error", error: errorMessage } : f)))
        reject(new Error(errorMessage))
      })

      xhr.timeout = 5 * 60 * 1000
      xhr.addEventListener("timeout", () => {
        const errorMessage = "Upload timeout"
        setUploadingFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "error", error: errorMessage } : f)))
        reject(new Error(errorMessage))
      })

      xhr.open("POST", "http://irush-server.rushpcb.com:5000/upload")
      xhr.send(formData)
    })
  }

  // Upload Excel files and process them immediately (requires RFQ ID)
  const uploadExcelFileWithProcessing = async (uploadingFile: UploadingFile): Promise<RFQFile> => {
    const { file, id } = uploadingFile

    try {
      // First, upload the file normally
      setUploadingFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "uploading", progress: 50 } : f)))

      const formData = new FormData()
      formData.append("files", file)

      const uploadResponse = await fetch("http://irush-server.rushpcb.com:5000/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`)
      }

      const uploadResult = await uploadResponse.json()
      const fileData = Array.isArray(uploadResult) ? uploadResult[0] : uploadResult

      const serverData = {
        id: fileData?.id || id,
        filename: fileData?.filename || file.name,
        originalname: fileData?.originalname || file.name,
        size: fileData?.size || file.size,
        mimetype: fileData?.mimetype || file.type,
      }

      // Mark as uploaded but not yet processed
      setUploadingFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "completed", progress: 100, serverData } : f)),
      )

      console.log(`✅ Excel file uploaded: ${file.name} - Ready for processing after RFQ creation`)

      return fileData
    } catch (error) {
      console.error(`❌ Excel upload failed for ${file.name}:`, error)

      let errorMessage = "Excel upload failed"
      if (error instanceof Error) {
        errorMessage = error.message
      }

      setUploadingFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "error", error: errorMessage } : f)))
      throw error
    }
  }

  // Process Excel files immediately after RFQ creation using your backend endpoint
  const processExcelFilesAfterRfqCreation = async (rfqId: string) => {
    const excelFiles = uploadingFiles.filter((f) => f.status === "completed" && isExcelFile(f.file))

    if (excelFiles.length === 0) {
      return
    }

    console.log(`🔄 Processing ${excelFiles.length} Excel files for RFQ: ${rfqId}`)

    for (const excelFile of excelFiles) {
      try {
        console.log(`📊 Processing Excel file: ${excelFile.file.name} for RFQ: ${rfqId}`)

        // Update status to processing
        setUploadingFiles((prev) => prev.map((f) => (f.id === excelFile.id ? { ...f, status: "processing" } : f)))

        // Process Excel file using your RFQ controller's upload-excel endpoint
        // This will call your processExcelAndSave method
        const extractedData = await uploadExcelFile(rfqId, excelFile.file)

        console.log(`✅ Excel processing completed for: ${excelFile.file.name}`, extractedData)

        // Update file with extracted data
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === excelFile.id
              ? {
                  ...f,
                  status: "extracted",
                  extractedData: {
                    specifications: extractedData.extractedSpecs || [],
                    assemblyData: extractedData.extractedAssembly || [],
                    images: extractedData.extractedImages || [],
                    totalSpecs: extractedData.extractedSpecs?.length || 0,
                  },
                }
              : f,
          ),
        )

        // Auto-populate extracted specifications into the form
        if (extractedData.extractedSpecs && extractedData.extractedSpecs.length > 0) {
          const newExtractedSpecs: SpecificationValue[] = extractedData.extractedSpecs
            .map((spec: any) => {
              // Find matching specification in the available specifications
              const matchingSpec = specifications.find(
                (s) =>
                  s.name.toLowerCase() === spec.key?.toLowerCase() ||
                  s.xlName?.toLowerCase() === spec.key?.toLowerCase(),
              )

              if (matchingSpec) {
                return {
                  specificationId: matchingSpec.id,
                  value: String(spec.value || ""),
                  unit: spec.unit,
                }
              }
              return null
            })
            .filter(Boolean) as SpecificationValue[]

          // Add extracted specifications to the form
          setExtractedSpecifications((prev) => [...prev, ...newExtractedSpecs])

          // Merge with existing specification values
          setSpecificationValues((prev) => {
            const merged = [...prev]
            newExtractedSpecs.forEach((newSpec) => {
              const existingIndex = merged.findIndex((spec) => spec.specificationId === newSpec.specificationId)
              if (existingIndex >= 0) {
                // Update existing specification
                merged[existingIndex] = newSpec
              } else {
                // Add new specification
                merged.push(newSpec)
              }
            })
            return merged
          })

          console.log(`📋 Auto-populated ${newExtractedSpecs.length} specifications from Excel`)
        }
      } catch (error) {
        console.error(`❌ Failed to process Excel file ${excelFile.file.name}:`, error)

        // Update status to error
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === excelFile.id
              ? {
                  ...f,
                  status: "error",
                  error: `Excel processing failed: ${error instanceof Error ? error.message : "Unknown error"}`,
                }
              : f,
          ),
        )
      }
    }
  }

  // Handle manual file upload
  const handleUploadFiles = async () => {
    const pendingFiles = uploadingFiles.filter((f) => f.status === "pending")

    if (pendingFiles.length === 0) {
      setFileUploadError("No files to upload")
      return
    }

    setIsUploading(true)
    setFileUploadError(null)

    try {
      console.log(`🔄 Starting upload for ${pendingFiles.length} files`)

      // Upload files sequentially to avoid overwhelming the server
      for (const uploadingFile of pendingFiles) {
        await uploadSingleFile(uploadingFile)
      }

      console.log("✅ All files uploaded successfully")
    } catch (error) {
      console.error("❌ Upload failed:", error)
      setFileUploadError(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsUploading(false)
    }
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

  // Handle form submission
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
      // Upload any pending files first
      const pendingFiles = uploadingFiles.filter((f) => f.status === "pending")

      if (pendingFiles.length > 0) {
        console.log(`🔄 Uploading ${pendingFiles.length} pending files before submission`)
        setIsUploading(true)

        try {
          for (const uploadingFile of pendingFiles) {
            await uploadSingleFile(uploadingFile)
          }
          console.log("✅ All pending files uploaded")
        } catch (uploadError) {
          console.error("❌ File upload failed:", uploadError)
          setFileUploadError(
            `File upload failed: ${uploadError instanceof Error ? uploadError.message : "Unknown error"}`,
          )
          return
        } finally {
          setIsUploading(false)
        }
      }

      // Get uploaded file IDs (excluding Excel files that will be processed separately)
      const completedFiles = uploadingFiles.filter((f) => f.status === "completed" && f.serverData)
      const fileIds = completedFiles.map((f) => ({ id: f.serverData!.id }))

      // Combine manual and extracted specifications
      const allSpecifications = [...specificationValues, ...extractedSpecifications]
      const uniqueSpecifications = allSpecifications.reduce((acc, spec) => {
        const existingIndex = acc.findIndex((s) => s.specificationId === spec.specificationId)
        if (existingIndex >= 0) {
          // Keep the latest value (manual input takes precedence over extracted)
          acc[existingIndex] = spec
        } else {
          acc.push(spec)
        }
        return acc
      }, [] as SpecificationValue[])

      console.log("📝 Creating RFQ with data:", {
        title,
        description,
        status,
        quantity,
        customerId: selectedCustomer?.id,
        servicesCount: selectedServices.length,
        specificationsCount: uniqueSpecifications.length,
        filesCount: fileIds.length,
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

      // Process Excel files immediately after RFQ creation
      await processExcelFilesAfterRfqCreation(createdRFQ.id)

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
  const hasExtractedSpecs = extractedSpecifications.length > 0

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

          {/* Extracted Specifications Alert */}
          {hasExtractedSpecs && (
            <Alert className="bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                ✅ Automatically extracted {extractedSpecifications.length} specifications from Excel files. You can
                review and modify them below.
              </AlertDescription>
            </Alert>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
                <SpecificationsSection
                  specifications={specifications}
                  specificationValues={specificationValues}
                  onSpecificationChange={handleSpecificationChange}
                  disabled={isFormDisabled}
                  extractedCount={extractedSpecifications.length}
                />

                {/* File Upload */}
                <FileUploadSection
                  uploadingFiles={uploadingFiles}
                  setUploadingFiles={setUploadingFiles}
                  isUploading={isUploading}
                  fileUploadError={fileUploadError}
                  setFileUploadError={setFileUploadError}
                  onUploadFiles={handleUploadFiles}
                  onRemoveFile={removeFile}
                  disabled={isFormDisabled}
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
