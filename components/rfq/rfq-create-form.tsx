

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
// import { fetchServices } from "@/lib/service"
// import { type Specification, fetchSpecifications } from "@/lib/rfq-option"

// // Import modular components
// import { CustomerSelectionStep } from "@/components/rfq/form-sections/customer-selection-step"
// import { FormHeader } from "@/components/rfq/form-sections/form-header"
// import { CustomerInfoCard } from "@/components/rfq/form-sections/customer-info-card"
// import { BasicInfoSection } from "@/components/rfq/form-sections/basic-info-section"
// import { ServicesSection } from "@/components/rfq/form-sections/services-section"
// import { SpecificationsSection } from "@/components/rfq/form-sections/specifications-section"
// import { SuccessState } from "@/components/rfq/form-sections/success-state"
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

//   // Handle extracted specifications from file upload - REMOVED EXTRACTION
//   const handleSpecsExtracted = (extractedSpecs: any[]) => {
//     // No extraction functionality - just log
//     console.log("File uploaded successfully")
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
//       const uniqueSpecifications = [...specificationValues]

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
//       const createdRFQ = await createdRFQ(rfqData)
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
import { useState, useEffect, useCallback } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { CheckCircle, AlertCircle, Loader2, FileText, Wrench, Settings } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { CreateRFQDto } from "@/types/rfq"
import type { Customer } from "@/types/customer"
import { CustomerSearchDialog } from "@/components/rfq/customer-search-dialog"
import { fetchServices, fetchSpecifications, type Specification } from "@/lib/rfq-option"

// Import modular components
import { CustomerSelectionStep } from "@/components/rfq/form-sections/customer-selection-step"
import { FormHeader } from "@/components/rfq/form-sections/form-header"
import { CustomerInfoCard } from "@/components/rfq/form-sections/customer-info-card"
import { BasicInfoSection } from "@/components/rfq/form-sections/basic-info-section"
import { ServicesSection } from "@/components/rfq/form-sections/services-section"
import { SpecificationsSection } from "@/components/rfq/form-sections/specifications-section"
import { SuccessState } from "@/components/rfq/form-sections/success-state"
import { FileUploadSection } from "./form-sections/file-upload-section"
import { Service } from "@/types/service"


interface RFQCreateFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  showCard?: boolean
}

// Updated to match API structure
interface SpecificationValue {
  specificationId: string
  value: string
  allowedUnits?: string[]
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
}

export function RFQCreateForm({ onSuccess, onCancel, showCard = true }: RFQCreateFormProps) {
  // Step tracking
  const [step, setStep] = useState<"customer-selection" | "form-completion">("customer-selection")
  const [activeTab, setActiveTab] = useState("basic-info")

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

  // Specifications - Updated structure
  const [specifications, setSpecifications] = useState<Specification[]>([])
  const [specificationValues, setSpecificationValues] = useState<SpecificationValue[]>([])

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
  const [services, setServices] = useState<Service[]>([])
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
      console.log("Loading services...")
      const servicesData = await fetchServices()
      console.log("Services loaded:", servicesData)

      // Filter active services
      const activeServices = servicesData.filter((service) => service.isActive && !service.deletedAt)
      setServices(activeServices)
      console.log("Active services:", activeServices)
    } catch (err) {
      console.error("Failed to load services:", err)
      setServicesError("Failed to load services. Please check your connection and try again.")
    } finally {
      setIsLoadingServices(false)
    }
  }

  const loadSpecifications = async () => {
    setIsLoadingSpecifications(true)
    setSpecificationsError(null)

    try {
      console.log("Loading specifications...")
      const specificationsData = await fetchSpecifications()
      console.log("Specifications loaded:", specificationsData)

      // Filter active specifications
      const activeSpecs = specificationsData.filter((spec) => spec.isActive && !spec.isDeleted)
      setSpecifications(activeSpecs)
      console.log("Active specifications:", activeSpecs)
    } catch (err) {
      console.error("Failed to load specifications:", err)
      setSpecificationsError("Failed to load specifications. Please check your connection and try again.")
    } finally {
      setIsLoadingSpecifications(false)
    }
  }

  const resetForm = () => {
    setStep("customer-selection")
    setActiveTab("basic-info")
    setTitle("")
    setDescription("")
    setQuantity("")
    setStatus("draft")
    setSelectedCustomer(null)
    setSelectedServices([])
    setSpecificationValues([])
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

  // Handle specification change - Updated to match API structure
  const handleSpecificationChange = useCallback((specId: string, value: string | number | boolean) => {
    setSpecificationValues((prev) => {
      const existingIndex = prev.findIndex((spec) => spec.specificationId === specId)

      if (!value || value === "" || value === false) {
        return existingIndex >= 0 ? prev.filter((_, index) => index !== existingIndex) : prev
      }

      const newSpecValue: SpecificationValue = {
        specificationId: specId,
        value: String(value),
        allowedUnits: [], // You can add unit handling here if needed
      }

      if (existingIndex >= 0) {
        return prev.map((spec, index) => (index === existingIndex ? newSpecValue : spec))
      }

      return [...prev, newSpecValue]
    })
  }, [])

  // Handle service toggle - memoized to prevent re-renders
  const handleServiceToggle = useCallback((serviceId: string) => {
    console.log("Toggling service:", serviceId)
    setSelectedServices((prev) => {
      const newServices = prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
      console.log("Updated services:", newServices)
      return newServices
    })
  }, [])

  // Remove file
  const removeFile = useCallback((fileId: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId))
  }, [])

  // Handle file upload
  const handleUploadFiles = async () => {
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

  // Submit function - Updated to match API structure
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

      console.log("📝 Creating RFQ with data:", {
        title,
        description,
        status,
        quantity,
        customerId: selectedCustomer?.id,
        servicesCount: selectedServices.length,
        specificationsCount: specificationValues.length,
        filesCount: fileIds.length,
      })

      // Updated RFQ data structure to match API expectations
      const rfqData: CreateRFQDto = {
        title: title.trim(),
        description: description.trim(),
        status,
        quantity: quantity.trim(),
        customerId: selectedCustomer!.id,
        ...(selectedServices.length > 0 && { services: selectedServices }),
        ...(specificationValues.length > 0 && { rfqSpecifications: specificationValues }),
        ...(fileIds.length > 0 && { files: fileIds }),
      }

      console.log("📤 Submitting RFQ data:", rfqData)
      const createdRFQ = await createRFQ(rfqData)
      console.log("✅ RFQ created successfully:", createdRFQ)

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
        extractedSpecifications={[]}
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

  // Calculate completion status for tabs
  const basicInfoComplete = title.trim() !== ""
  const servicesComplete = selectedServices.length > 0
  const specificationsComplete = specificationValues.length > 0
  const filesComplete = uploadingFiles.filter((f) => f.status === "completed").length > 0

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <FormHeader
        customer={selectedCustomer}
        onBackToCustomerSelection={handleBackToCustomerSelection}
        isLoading={isLoading}
      />

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading form data...</span>
        </div>
      )}

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

          {/* Main Form with Tabs */}
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic-info" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Basic Info
                      {basicInfoComplete && (
                        <Badge variant="secondary" className="ml-1 h-4 w-4 p-0">
                          ✓
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="services" className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      Services
                      {servicesComplete && (
                        <Badge variant="secondary" className="ml-1 h-4 w-4 p-0">
                          ✓
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="specifications" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Specifications
                      {specificationsComplete && (
                        <Badge variant="secondary" className="ml-1 h-4 w-4 p-0">
                          ✓
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="files" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Files
                      {filesComplete && (
                        <Badge variant="secondary" className="ml-1 h-4 w-4 p-0">
                          ✓
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic-info" className="mt-6">
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
                  </TabsContent>

                  <TabsContent value="services" className="mt-6">
                    <ServicesSection
                      services={services}
                      selectedServices={selectedServices}
                      onServiceToggle={handleServiceToggle}
                      disabled={isFormDisabled}
                      isLoading={isLoadingServices}
                      error={servicesError}
                    />
                  </TabsContent>

                  <TabsContent value="specifications" className="mt-6">
                    <SpecificationsSection
                      specifications={specifications}
                      specificationValues={specificationValues}
                      onSpecificationChange={handleSpecificationChange}
                      disabled={isFormDisabled}
                      isLoading={isLoadingSpecifications}
                      error={specificationsError}
                    />
                  </TabsContent>

                  <TabsContent value="files" className="mt-6">
                    <FileUploadSection
                      uploadingFiles={uploadingFiles}
                      setUploadingFiles={setUploadingFiles}
                      isUploading={isUploading}
                      setIsUploading={setIsUploading}
                      fileUploadError={fileUploadError}
                      setFileUploadError={setFileUploadError}
                      disabled={isFormDisabled}
                    />
                  </TabsContent>
                </Tabs>

                {/* Navigation and Submit Buttons */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <div className="flex gap-2">
                    {activeTab !== "basic-info" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const tabs = ["basic-info", "services", "specifications", "files"]
                          const currentIndex = tabs.indexOf(activeTab)
                          if (currentIndex > 0) {
                            setActiveTab(tabs[currentIndex - 1])
                          }
                        }}
                        disabled={isSubmitting}
                      >
                        Previous
                      </Button>
                    )}
                    {activeTab !== "files" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const tabs = ["basic-info", "services", "specifications", "files"]
                          const currentIndex = tabs.indexOf(activeTab)
                          if (currentIndex < tabs.length - 1) {
                            setActiveTab(tabs[currentIndex + 1])
                          }
                        }}
                        disabled={isSubmitting}
                      >
                        Next
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-2">
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
